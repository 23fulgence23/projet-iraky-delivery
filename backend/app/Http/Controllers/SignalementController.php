<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Notification;
use App\Models\Signalement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class SignalementController extends Controller
{
    const MOTIFS = [
        'retard'       => 'Retard',
        'injoignable'  => 'Personne injoignable',
        'comportement' => 'Comportement inapproprié',
        'non_conforme' => 'Service non conforme',
        'paiement'     => 'Problème de paiement ou de tarif',
        'autre'        => 'Autre problème',
    ];

    const STATUTS = [
        'nouveau'  => 'nouveau',
        'en_cours' => 'en cours',
        'resolu'   => 'résolu',
        'rejete'   => 'rejeté',
    ];

    private function utilisateur(): User
    {
        $u = JWTAuth::user();
        if (!$u) {
            abort(401, 'Non authentifié.');
        }
        return $u;
    }

    private function admin(): User
    {
        $u = JWTAuth::user();
        if (!$u || $u->role !== 'admin') {
            abort(403, 'Accès refusé.');
        }
        return $u;
    }

    private function notifier(int $userId, string $texte, string $type = 'info'): void
    {
        Notification::create([
            'user_id'     => $userId,
            'texte'       => Str::limit($texte, 240),
            'type'        => $type,
            'commande_id' => null,
        ]);
    }

    private function nom(?User $u): ?string
    {
        return $u ? trim($u->prenom . ' ' . $u->nom) : null;
    }

    private function resume(Signalement $s): array
    {
        return [
            'id'            => $s->id,
            'commande_id'   => $s->commande_id,
            'service'       => $s->commande ? $s->commande->service : null,
            'auteur_role'   => $s->auteur_role,
            'auteur'        => $this->nom($s->auteur),
            'cible'         => $this->nom($s->cible),
            'motif'         => $s->motif,
            'description'   => $s->description,
            'statut'        => $s->statut,
            'reponse_admin' => $s->reponse_admin,
            'created_at'    => $s->created_at ? $s->created_at->toIso8601String() : null,
        ];
    }

    // ── Client / coursier : creer un signalement ───────
    public function store(Request $request)
    {
        $u = $this->utilisateur();
        if (!in_array($u->role, ['client', 'coursier'], true)) {
            return response()->json(['message' => 'Réservé aux clients et aux coursiers.'], 403);
        }

        $data = $request->validate([
            'commande_id' => 'required|integer|exists:commandes,id',
            'motif'       => 'required|string|in:' . implode(',', array_keys(self::MOTIFS)),
            'description' => 'required|string|min:10|max:1000',
        ], [
            'description.min' => 'Décrivez le problème en au moins 10 caractères.',
        ]);

        $cmd = Commande::findOrFail($data['commande_id']);

        $estClient   = (int) $cmd->client_id === (int) $u->id;
        $estCoursier = $cmd->coursier_id && (int) $cmd->coursier_id === (int) $u->id;
        if (($u->role === 'client' && !$estClient) || ($u->role === 'coursier' && !$estCoursier)) {
            return response()->json(['message' => 'Vous ne participez pas à cette course.'], 403);
        }

        $dejaOuvert = Signalement::where('commande_id', $cmd->id)
            ->where('auteur_id', $u->id)
            ->whereIn('statut', ['nouveau', 'en_cours'])
            ->exists();
        if ($dejaOuvert) {
            return response()->json(['message' => 'Vous avez déjà un signalement en cours pour cette course.'], 422);
        }

        $cibleId = $u->role === 'client' ? $cmd->coursier_id : $cmd->client_id;

        $s = Signalement::create([
            'commande_id' => $cmd->id,
            'auteur_id'   => $u->id,
            'auteur_role' => $u->role,
            'cible_id'    => $cibleId,
            'motif'       => $data['motif'],
            'description' => trim($data['description']),
            'statut'      => 'nouveau',
        ]);

        foreach (User::where('role', 'admin')->get() as $admin) {
            $this->notifier($admin->id,
                "🚩 Nouveau signalement : " . self::MOTIFS[$data['motif']] . " — commande #{$cmd->id} — par " . $this->nom($u));
        }

        return response()->json(['message' => 'Signalement envoyé.', 'id' => $s->id], 201);
    }

    // ── Admin : liste ──────────────────────────────────
    public function liste(Request $request)
    {
        $this->admin();

        $q = Signalement::with(['auteur:id,nom,prenom', 'cible:id,nom,prenom', 'commande:id,service'])
            ->orderByRaw("CASE statut WHEN 'nouveau' THEN 0 WHEN 'en_cours' THEN 1 ELSE 2 END")
            ->orderByDesc('created_at');

        if ($request->filled('statut') && array_key_exists($request->statut, self::STATUTS)) {
            $q->where('statut', $request->statut);
        }

        return response()->json($q->limit(300)->get()->map(fn ($s) => $this->resume($s)));
    }

    // ── Admin : nombre de nouveaux (badge du menu) ─────
    public function compteur()
    {
        $this->admin();
        return response()->json(['nouveaux' => Signalement::where('statut', 'nouveau')->count()]);
    }

    // ── Admin : detail + donnees pour la carte ─────────
    public function detail($id)
    {
        $this->admin();
        $s = Signalement::with(['auteur', 'cible', 'commande.client', 'commande.coursier'])->findOrFail($id);
        $c = $s->commande;

        $personne = fn (?User $u) => $u ? [
            'id'        => $u->id,
            'nom'       => $u->nom,
            'prenom'    => $u->prenom,
            'telephone' => $u->telephone,
            'email'     => $u->email,
            'adresse'   => $u->adresse,
            'latitude'  => $u->latitude !== null ? (float) $u->latitude : null,
            'longitude' => $u->longitude !== null ? (float) $u->longitude : null,
            'position_latitude'  => $u->position_lat !== null ? (float) $u->position_lat : null,
            'position_longitude' => $u->position_lng !== null ? (float) $u->position_lng : null,
            'position_at'        => $u->position_at ? \Illuminate\Support\Carbon::parse($u->position_at)->toIso8601String() : null,
        ] : null;

        return response()->json(array_merge($this->resume($s), [
            'commande' => $c ? [
                'id'              => $c->id,
                'service'         => $c->service,
                'moyen'           => $c->moyen,
                'tarif'           => $c->tarif,
                'statut'          => $c->statut,
                'adresse_pickup'  => $c->adresse_pickup,
                'detail'          => $c->detail,
                'heure_debut'     => $c->getRawOriginal('heure_debut'),
                'heure_livraison' => $c->getRawOriginal('heure_livraison'),
            ] : null,
            'client'    => $personne($c ? $c->client : null),
            'coursier'  => $personne($c ? $c->coursier : null),
            'positions' => ($c && $c->coursier_id)
                ? \App\Models\PositionUtilisateur::where('commande_id', $c->id)->where('user_id', $c->coursier_id)
                    ->orderBy('created_at')->limit(2000)->get(['latitude', 'longitude', 'created_at'])
                    ->map(fn ($p) => ['lat' => (float) $p->latitude, 'lng' => (float) $p->longitude, 'at' => $p->created_at ? $p->created_at->toIso8601String() : null])
                    ->values()
                : [],
        ]));
    }

    // ── Admin : changer le statut / repondre ───────────
    public function traiter(Request $request, $id)
    {
        $admin = $this->admin();
        $data = $request->validate([
            'statut'  => 'required|in:' . implode(',', array_keys(self::STATUTS)),
            'reponse' => 'nullable|string|max:1000',
        ]);

        $s = Signalement::findOrFail($id);
        $reponse = isset($data['reponse']) ? trim($data['reponse']) : null;
        if ($reponse === '') {
            $reponse = null;
        }

        $statutChange  = $s->statut !== $data['statut'];
        $reponseChange = $reponse !== null && $reponse !== $s->reponse_admin;

        $s->statut        = $data['statut'];
        $s->reponse_admin = $reponse;
        $s->traite_par    = $admin->id;
        $s->traite_le     = now();
        $s->save();

        if (($statutChange || $reponseChange) && $s->statut !== 'nouveau') {
            $ref   = $s->commande_id ? " (commande #{$s->commande_id})" : '';
            $texte = "📩 Votre signalement{$ref} est " . self::STATUTS[$s->statut] . '.'
                   . ($reponse ? " Réponse : {$reponse}" : '');
            $this->notifier($s->auteur_id, $texte, $s->statut === 'resolu' ? 'success' : 'info');
        }

        return response()->json(['message' => 'Signalement mis à jour.']);
    }

    // ── Admin : supprimer ──────────────────────────────
    public function supprimer($id)
    {
        $this->admin();
        Signalement::where('id', $id)->delete();
        return response()->json(['message' => 'Signalement supprimé.']);
    }
}
