<?php
namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Notification;
use App\Models\User; 
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class CommandeController extends Controller
{
    // ── Client publie ──────────────────────────────
    public function store(Request $request)
    {
        $user = JWTAuth::user();
        $request->validate([
            'service'           => 'required|string',
            'moyen'             => 'required|string',
            'tarif'             => 'required|numeric',
            'detail'            => 'required|string',
            'heure_publication' => 'required',
            'heure_debut'       => 'required',
            'heure_livraison'   => 'required',
        ]);

        $commande = Commande::create([
            'client_id'         => $user->id,
            'service'           => $request->service,
            'moyen'             => $request->moyen,
            'tarif'             => $request->tarif,
            'detail'            => $request->detail,
            'adresse_pickup'    => $request->adresse_pickup,
            'heure_publication' => $request->heure_publication,
            'heure_debut'       => $request->heure_debut,
            'heure_livraison'   => $request->heure_livraison,
            'statut'            => 'en_attente',
        ]);

        // ✅ Notifier TOUS les admins (pas seulement le premier)
        $admins = \App\Models\User::where('role','admin')->get();
        foreach ($admins as $admin) {
            \App\Models\Notification::create([
                'user_id'     => $admin->id,
                'texte'       => "📦 Nouvelle commande : {$commande->service} — Client #{$user->prenom} {$user->nom}",
                'type'        => 'info',
                'commande_id' => $commande->id,
            ]);
        }

        return response()->json([
            'commande' => $commande->load('client','coursier')
        ], 201);
    }

   
        // ── Commandes du client ────────────────────────
        public function mesCommandes()
        {
            $user = JWTAuth::user();
            $commandes = Commande::where('client_id', $user->id)
                ->with('coursier') // charge déjà la relation
                ->orderByDesc('created_at')
                ->get()
                ->map(fn($c) => [
                    ...$c->toArray(),
                    'date'            => $c->created_at->format('Y-m-d'),
                    'accord_client'   => (bool)$c->accord_client,
                    'accord_coursier' => (bool)$c->accord_coursier,
                    // ✅ Expose la note et les trophées du coursier directement
                    'coursier_note'     => $c->coursier->note ?? null,
                    'coursier_trophees' => $c->coursier->trophees ?? null,
                ]);
            return response()->json($commandes);
        }

    // ── Commandes disponibles ──────────────────────
    public function disponibles()
    {
        $commandes = Commande::where('statut', 'en_attente')
            ->whereNull('coursier_id')
            ->with('client')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($c) => [
                ...$c->toArray(),
                'date' => $c->created_at->format('Y-m-d'),
            ]);
        return response()->json($commandes);
    }

    // ── Missions du coursier ───────────────────────
    public function mesMissions()
    {
        $user = JWTAuth::user();
        $missions = Commande::where('coursier_id', $user->id)
            ->with('client')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($c) => [
                ...$c->toArray(),
                'date'            => $c->created_at->format('Y-m-d'),
                'accord_client'   => (bool)$c->accord_client,
                'accord_coursier' => (bool)$c->accord_coursier,
            ]);
        return response()->json($missions);
    }

    // ── Coursier prend mission ─────────────────────
public function prendre($id)
{
    $user     = JWTAuth::user();
    $commande = Commande::findOrFail($id);

    if ($commande->statut !== 'en_attente') {
        return response()->json(['message' => 'Mission non disponible'], 400);
    }

    $commande->update([
        'coursier_id' => $user->id,
        'statut'      => 'negociable',
    ]);

    // ✅ Notifier TOUS les admins que le coursier a pris la mission
    $admins = \App\Models\User::where('role','admin')->get();
    foreach ($admins as $admin) {
        \App\Models\Notification::create([
            'user_id'     => $admin->id,
            'texte'       => "🚴 {$user->prenom} {$user->nom} a pris la mission : {$commande->service}",
            'type'        => 'info',
            'commande_id' => $commande->id,
        ]);
    }

    Notification::create([
        'user_id'     => $commande->client_id,
        'texte'       => "{$user->prenom} a pris votre commande — En négociation",
        'type'        => 'info',
        'commande_id' => $commande->id,
    ]);

    return response()->json([
        'message'  => 'Mission prise',
        'commande' => $commande->fresh()->load('client','coursier'),
    ]);
}

    // ── CLIENT accepte en PREMIER ──────────────────
    // ✅ CORRECTION : cast (int) pour éviter "Non autorisé"
    public function accepterParClient($id)
    {
        $user     = JWTAuth::user();
        $commande = Commande::findOrFail($id);

        // ✅ Cast int — CRITIQUE pour éviter 403
        if ((int)$commande->client_id !== (int)$user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // Marque accord client
        $commande->accord_client = true;

        // Si le coursier avait déjà accepté → statut accepte directement
        if ($commande->accord_coursier) {
            $commande->statut = 'accepte';
        }
        $commande->save();

        // Notifier le coursier
        if ($commande->coursier_id) {
            Notification::create([
                'user_id'     => $commande->coursier_id,
                'texte'       => "✅ Le client a accepté l'accord pour : {$commande->service}. À votre tour !",
                'type'        => 'success',
                'commande_id' => $commande->id,
            ]);
        }

        $fresh = $commande->fresh();
        return response()->json([
            'message'  => 'Accord client enregistré',
            'commande' => [
                ...$fresh->toArray(),
                'accord_client'   => (bool)$fresh->accord_client,
                'accord_coursier' => (bool)$fresh->accord_coursier,
            ],
        ]);
    }

    // ── COURSIER accepte — SEULEMENT si client a accepté d'abord ──
    // ✅ CORRECTION : bloque si accord_client = false
    public function accepterParCoursier($id)
    {
        $user     = JWTAuth::user();
        $commande = Commande::findOrFail($id);

        // ✅ Cast int
        if ((int)$commande->coursier_id !== (int)$user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // ✅ BLOQUE si le client n'a pas encore accepté
        if (!$commande->accord_client) {
            return response()->json([
                'message' => '🔒 Le client doit accepter en premier.'
            ], 400);
        }

        $commande->accord_coursier = true;
        $commande->statut          = 'accepte';
        $commande->save();

        // Notifier le client
        Notification::create([
            'user_id'     => $commande->client_id,
            'texte'       => "✅ Accord validé ! Votre commande {$commande->service} est acceptée.",
            'type'        => 'success',
            'commande_id' => $commande->id,
        ]);

        $fresh = $commande->fresh();
        return response()->json([
            'message'  => 'Accord total — commande acceptée',
            'commande' => [
                ...$fresh->toArray(),
                'accord_client'   => (bool)$fresh->accord_client,
                'accord_coursier' => (bool)$fresh->accord_coursier,
            ],
        ]);
    }

    // ── Refuser — les deux peuvent refuser ────────
    public function refuser($id)
    {
        $user     = JWTAuth::user();
        $commande = Commande::findOrFail($id);

        $estClient   = (int)$commande->client_id   === (int)$user->id;
        $estCoursier = $commande->coursier_id && (int)$commande->coursier_id === (int)$user->id;

        if (!$estClient && !$estCoursier) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        // Notifier l'autre partie
        $autreId = $estClient ? $commande->coursier_id : $commande->client_id;
        if ($autreId) {
            Notification::create([
                'user_id'     => $autreId,
                'texte'       => "❌ L'accord a été refusé — {$commande->service} remis en attente.",
                'type'        => 'warning',
                'commande_id' => $commande->id,
            ]);
        }

        // Reset complet
        $commande->update([
            'statut'          => 'en_attente',
            'coursier_id'     => null,
            'accord_client'   => false,
            'accord_coursier' => false,
        ]);

        return response()->json(['message' => 'Mission refusée — remise en attente']);
    }

    // ── Client termine + note ──────────────────────
public function terminer(Request $request, $id)
{
    $user     = JWTAuth::user();
    $commande = Commande::findOrFail($id);

    if ((int) $commande->client_id !== (int) $user->id) {
        return response()->json(['message' => 'Non autorisé'], 403);
    }

    if ($commande->statut !== 'accepte') {
        return response()->json(['message' => 'La commande doit être acceptée avant de terminer'], 400);
    }

    // ✅ Note obligatoire entre 1 et 5 — pas de défaut silencieux
    $request->validate([
        'note' => 'required|integer|min:1|max:5',
    ], [
        'note.required' => 'Vous devez attribuer une note au coursier.',
        'note.min'       => 'La note minimale est 1 étoile.',
        'note.max'       => 'La note maximale est 5 étoiles.',
    ]);

    $note = (int) $request->note;

    $commande->update([
        'statut' => 'termine',
        'note'   => $note,
    ]);

    if ($commande->coursier_id) {
        $coursier = User::find($commande->coursier_id);

        if ($coursier) {
            // ✅ Moyenne des notes sur toutes les missions terminées
            $missionsTerm = Commande::where('coursier_id', $coursier->id)
                ->where('statut', 'termine')
                ->whereNotNull('note')
                ->get();

            $nbTerminees = $missionsTerm->count();
            $moyNote     = $nbTerminees > 0 ? round($missionsTerm->avg('note'), 1) : 0;

            // ✅ Système trophées : chaque note ajoutée incrémente etoiles_actuelles
            // À 5 étoiles accumulées → +1 trophée, etoiles_actuelles repart à 0
            $etoilesActuelles = $coursier->etoiles_actuelles + $note;
            $nouveauxTrophees = intdiv($etoilesActuelles, 5);
            $etoilesRestantes = $etoilesActuelles % 5;

            $coursier->update([
                'nb_terminees'      => $nbTerminees,
                'nb_missions'       => Commande::where('coursier_id', $coursier->id)->count(),
                'note'              => $moyNote,
                'trophees'          => $coursier->trophees + $nouveauxTrophees,
                'etoiles_actuelles' => $etoilesRestantes,
            ]);
        }

        Notification::create([
            'user_id'     => $commande->coursier_id,
            'texte'       => "🎉 Mission terminée ! Le client vous a donné {$note}/5 ⭐",
            'type'        => 'success',
            'commande_id' => $commande->id,
        ]);

        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id'     => $admin->id,
                'texte'       => "🏁 Commande terminée : {$commande->service} — {$note}⭐",
                'type'        => 'success',
                'commande_id' => $commande->id,
            ]);
        }
    }

    return response()->json([
        'message'  => 'Commande terminée',
        'commande' => $commande->fresh(),
    ]);
}
    // ── Supprimer commande ─────────────────────────
    public function destroy($id)
    {
        $user     = JWTAuth::user();
        $commande = Commande::findOrFail($id);

        if ((int)$commande->client_id !== (int)$user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $commande->delete();
        return response()->json(['message' => 'Commande supprimée']);
    }
}