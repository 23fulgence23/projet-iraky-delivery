<?php

namespace App\Http\Controllers;

use App\Models\CommandeTenue;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class TenueController extends Controller
{
    // Prix en ariary : fixes cote serveur
    const PRIX = ['tshirt' => 20000, 'gilet' => 25000];
    const LIBELLES = ['tshirt' => 'T-shirt', 'gilet' => 'Gilet'];
    const TAILLES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    private function coursier(): User
    {
        $u = JWTAuth::user();
        if (!$u || $u->role !== 'coursier') {
            abort(403, 'Réservé aux coursiers.');
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

    private function etat($commandes): string
    {
        if ($commandes->contains('statut', 'validee')) {
            return 'avec_tenue';
        }
        if ($commandes->contains('statut', 'en_attente')) {
            return 'en_attente';
        }
        return 'sans_tenue';
    }

    private function ligne(CommandeTenue $c): array
    {
        return [
            'id'                 => $c->id,
            'article'            => $c->article,
            'libelle'            => self::LIBELLES[$c->article] ?? $c->article,
            'taille'             => $c->taille,
            'quantite'           => (int) $c->quantite,
            'total'              => (int) $c->total,
            'reference_paiement' => $c->reference_paiement,
            'statut'             => $c->statut,
            'motif_refus'        => $c->motif_refus,
            'date'               => $c->created_at ? $c->created_at->format('d/m/Y H:i') : null,
        ];
    }

    // ---- Coursier ----
    public function mes()
    {
        $u = $this->coursier();
        $cmds = CommandeTenue::where('user_id', $u->id)->orderByDesc('id')->get();
        return response()->json([
            'prix'      => self::PRIX,
            'tailles'   => self::TAILLES,
            'etat'      => $this->etat($cmds),
            'commandes' => $cmds->map(fn ($c) => $this->ligne($c))->values(),
        ]);
    }

    public function commander(Request $request)
    {
        $u = $this->coursier();
        $data = $request->validate([
            'article'            => 'required|in:tshirt,gilet',
            'taille'             => 'required|in:XS,S,M,L,XL,XXL',
            'quantite'           => 'required|integer|min:1|max:5',
            'reference_paiement' => 'required|string|max:100',
        ], [
            'reference_paiement.required' => 'La référence de paiement est obligatoire.',
        ]);

        if (CommandeTenue::where('user_id', $u->id)->where('statut', 'en_attente')->exists()) {
            return response()->json(['message' => 'Une commande est déjà en attente de validation.'], 422);
        }

        $prix = self::PRIX[$data['article']];
        $c = CommandeTenue::create([
            'user_id'            => $u->id,
            'article'            => $data['article'],
            'taille'             => $data['taille'],
            'quantite'           => $data['quantite'],
            'prix_unitaire'      => $prix,
            'total'              => $prix * (int) $data['quantite'],
            'reference_paiement' => $data['reference_paiement'],
            'statut'             => 'en_attente',
        ]);

        $libelle = self::LIBELLES[$c->article];
        foreach (User::where('role', 'admin')->get() as $admin) {
            Notification::create([
                'user_id'     => $admin->id,
                'texte'       => "Commande de tenue : {$u->prenom} {$u->nom} — {$libelle} {$c->taille} x{$c->quantite}",
                'type'        => 'info',
                'commande_id' => null,
            ]);
        }

        return response()->json(['commande' => $this->ligne($c)], 201);
    }

    // ---- Admin ----
    public function adminListe()
    {
        $this->admin();
        $cmds = CommandeTenue::with('user:id,nom,prenom,telephone')->orderByDesc('id')->limit(500)->get();
        $parUser = $cmds->groupBy('user_id');

        $coursiers = User::where('role', 'coursier')->where('statut', 'actif')
            ->orderBy('nom')->get(['id', 'nom', 'prenom', 'telephone'])
            ->map(function ($u) use ($parUser) {
                $liste = $parUser->get($u->id, collect());
                return [
                    'id'           => $u->id,
                    'nom_complet'  => trim($u->prenom . ' ' . $u->nom),
                    'telephone'    => $u->telephone,
                    'etat'         => $this->etat($liste),
                    'nb_commandes' => $liste->count(),
                ];
            })->values();

        $commandes = $cmds->map(fn ($c) => $this->ligne($c) + [
            'coursier'  => $c->user ? trim($c->user->prenom . ' ' . $c->user->nom) : '—',
            'telephone' => $c->user ? $c->user->telephone : null,
        ])->values();

        return response()->json([
            'resume' => [
                'avec_tenue' => $coursiers->where('etat', 'avec_tenue')->count(),
                'en_attente' => $coursiers->where('etat', 'en_attente')->count(),
                'sans_tenue' => $coursiers->where('etat', 'sans_tenue')->count(),
                'total'      => $coursiers->count(),
            ],
            'coursiers' => $coursiers,
            'commandes' => $commandes,
        ]);
    }

    public function valider($id)
    {
        $this->admin();
        $c = CommandeTenue::findOrFail($id);
        if ($c->statut !== 'en_attente') {
            return response()->json(['message' => 'Cette commande a déjà été traitée.'], 422);
        }
        $c->update(['statut' => 'validee', 'valide_le' => now(), 'motif_refus' => null]);

        Notification::create([
            'user_id'     => $c->user_id,
            'texte'       => 'Votre commande de tenue (' . self::LIBELLES[$c->article] . ' ' . $c->taille . ') est validée.',
            'type'        => 'success',
            'commande_id' => null,
        ]);
        return response()->json(['ok' => true]);
    }

    public function refuser(Request $request, $id)
    {
        $this->admin();
        $data = $request->validate(['motif' => 'nullable|string|max:255']);
        $c = CommandeTenue::findOrFail($id);
        if ($c->statut !== 'en_attente') {
            return response()->json(['message' => 'Cette commande a déjà été traitée.'], 422);
        }
        $c->update(['statut' => 'refusee', 'motif_refus' => $data['motif'] ?? null]);

        $motif = !empty($data['motif']) ? ' Motif : ' . $data['motif'] : '';
        Notification::create([
            'user_id'     => $c->user_id,
            'texte'       => 'Votre commande de tenue (' . self::LIBELLES[$c->article] . ' ' . $c->taille . ') est refusée.' . $motif,
            'type'        => 'warning',
            'commande_id' => null,
        ]);
        return response()->json(['ok' => true]);
    }
}
