<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\NotificationIraky;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class CommandeController extends Controller
{
    // ✅ Client publie une commande
    public function publier(Request $request)
    {
        $request->validate([
            'service'           => 'required|string',
            'moyen'             => 'required|string',
            'tarif'             => 'required|integer',
            'detail'            => 'required|string',
            'adresse_pickup'    => 'nullable|string',
            'heure_publication' => 'required|string',
            'heure_debut'       => 'required|string',
            'heure_livraison'   => 'required|string',
        ]);

        $client = JWTAuth::user();

        $commande = Commande::create([
            'client_id'         => $client->id,
            'service'           => $request->service,
            'moyen'             => $request->moyen,
            'tarif'             => $request->tarif,
            'statut'            => 'en_attente',
            'adresse_pickup'    => $request->adresse_pickup,
            'detail'            => $request->detail,
            'heure_publication' => $request->heure_publication,
            'heure_debut'       => $request->heure_debut,
            'heure_livraison'   => $request->heure_livraison,
            'date'              => now()->toDateString(),
        ]);

        // ✅ Notifier TOUS les coursiers actifs
        $coursiers = User::where('role', 'coursier')
                         ->where('statut', 'actif')
                         ->get();

        foreach ($coursiers as $coursier) {
            NotificationIraky::create([
                'user_id'     => $coursier->id,
                'texte'       => "Nouvelle commande disponible : {$commande->service} — {$commande->tarif} Ar",
                'type'        => 'info',
                'commande_id' => $commande->id,
            ]);
        }

        return response()->json([
            'message'  => 'Commande publiée avec succès',
            'commande' => $commande->load('client'),
        ], 201);
    }

    // ✅ Liste des commandes disponibles pour les coursiers (en_attente)
    public function disponibles()
    {
        $commandes = Commande::where('statut', 'en_attente')
            ->with('client:id,nom,prenom')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($commandes);
    }

    // ✅ Coursier prend une mission → statut devient negociable
    public function prendreMission(Request $request, $id)
    {
        $coursier = JWTAuth::user();

        $commande = Commande::findOrFail($id);

        if ($commande->statut !== 'en_attente') {
            return response()->json(['message' => 'Cette commande n\'est plus disponible'], 400);
        }

        $commande->update([
            'coursier_id' => $coursier->id,
            'statut'      => 'negociable',
        ]);

        // ✅ Notifier le client
        NotificationIraky::create([
            'user_id'     => $commande->client_id,
            'texte'       => "{$coursier->prenom} {$coursier->nom} a pris votre commande — En négociation",
            'type'        => 'info',
            'commande_id' => $commande->id,
        ]);

        return response()->json([
            'message'  => 'Mission prise avec succès',
            'commande' => $commande->load('client', 'coursier'),
        ]);
    }

    // ✅ Client change statut → accepte
    public function accepter($id)
    {
        $client   = JWTAuth::user();
        $commande = Commande::where('id', $id)
                            ->where('client_id', $client->id)
                            ->firstOrFail();

        $commande->update(['statut' => 'accepte']);

        // ✅ Notifier le coursier
        NotificationIraky::create([
            'user_id'     => $commande->coursier_id,
            'texte'       => "Le client a accepté votre proposition — Commande : {$commande->service}",
            'type'        => 'success',
            'commande_id' => $commande->id,
        ]);

        return response()->json(['message' => 'Commande acceptée', 'commande' => $commande]);
    }

    // ✅ Client marque comme terminé + étoile automatique au coursier
    public function terminer(Request $request, $id)
    {
        $request->validate([
            'note' => 'required|integer|min:1|max:5',
        ]);

        $client   = JWTAuth::user();
        $commande = Commande::where('id', $id)
                            ->where('client_id', $client->id)
                            ->firstOrFail();

        $commande->update([
            'statut' => 'termine',
            'note'   => $request->note,
        ]);

        // ✅ Mettre à jour la note du coursier (moyenne)
        $coursier = User::find($commande->coursier_id);
        if ($coursier) {
            $totalCommandes = Commande::where('coursier_id', $coursier->id)
                                      ->where('statut', 'termine')
                                      ->whereNotNull('note')
                                      ->count();

            $sommeNotes = Commande::where('coursier_id', $coursier->id)
                                  ->where('statut', 'termine')
                                  ->whereNotNull('note')
                                  ->sum('note');

            $nouvelleMoyenne = $totalCommandes > 0
                ? round($sommeNotes / $totalCommandes, 1)
                : $request->note;

            $coursier->update([
                'note'         => $nouvelleMoyenne,
                'nb_terminees' => $totalCommandes,
                'nb_missions'  => Commande::where('coursier_id', $coursier->id)->count(),
            ]);

            // ✅ Notifier le coursier
            NotificationIraky::create([
                'user_id'     => $coursier->id,
                'texte'       => "Bravo ! Service terminé — Vous avez reçu {$request->note} étoile(s) — Nouvelle note : {$nouvelleMoyenne}/5",
                'type'        => 'success',
                'commande_id' => $commande->id,
            ]);
        }

        return response()->json([
            'message'  => 'Commande terminée et note enregistrée',
            'commande' => $commande,
        ]);
    }

    // ✅ Mes commandes (client)
    public function mesCommandes()
    {
        $client   = JWTAuth::user();
        $commandes = Commande::where('client_id', $client->id)
            ->with('coursier:id,nom,prenom,note')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($commandes);
    }

    // ✅ Mes missions (coursier)
    public function mesMissions()
    {
        $coursier = JWTAuth::user();
        $missions = Commande::where('coursier_id', $coursier->id)
            ->with('client:id,nom,prenom')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($missions);
    }
}