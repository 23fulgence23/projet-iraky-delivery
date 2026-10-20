<?php

namespace App\Http\Controllers;

use App\Models\AbonnementPaiement;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class AbonnementController extends Controller
{
    const MONTANT         = 10000;
    const NUMERO_PAIEMENT = '+261 32 53 200 54';
    const BENEFICIAIRE    = 'Administrateur';

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

    private function notifier(int $userId, string $texte, string $type = 'info'): void
    {
        Notification::create([
            'user_id'     => $userId,
            'texte'       => Str::limit($texte, 240),
            'type'        => $type,
            'commande_id' => null,
        ]);
    }

    // ── Coursier : etat de son abonnement ──────────────
    public function etat()
    {
        User::suspendreAbonnementsExpires();
        $u = $this->coursier();
        $u->refresh();

        $expire  = $u->abonnement_expire ? Carbon::parse($u->abonnement_expire) : null;
        $dernier = AbonnementPaiement::where('user_id', $u->id)->orderByDesc('id')->first();

        return response()->json([
            'nom' => $u->nom, 'prenom' => $u->prenom, 'email' => $u->email,
            'statut' => $u->statut,
            'suspendu'          => $u->statut === 'suspendu',
            'abonnement_expire' => $expire ? $expire->toIso8601String() : null,
            'jours_restants'    => $expire ? (int) now()->startOfDay()->diffInDays($expire->copy()->startOfDay(), false) : null,
            'montant'           => self::MONTANT,
            'numero_paiement'   => self::NUMERO_PAIEMENT,
            'beneficiaire'      => self::BENEFICIAIRE,
            'dernier_paiement'  => $dernier ? [
                'id'          => $dernier->id,
                'statut'      => $dernier->statut,
                'reference'   => $dernier->reference,
                'paye_le'     => $dernier->paye_le,
                'motif_rejet' => $dernier->motif_rejet,
            ] : null,
        ]);
    }

    // ── Coursier : soumettre un paiement ───────────────
    public function soumettre(Request $request)
    {
        $u = $this->coursier();

        if (!in_array($u->statut, ['actif', 'suspendu'], true)) {
            return response()->json(['message' => 'Votre compte ne permet pas cette opération.'], 403);
        }

        $data = $request->validate([
            'numero_envoi' => 'required|string|max:30',
            'reference'    => 'required|string|max:60',
            'paye_le'      => 'nullable|date',
            'montant'      => 'required|integer|min:10000',
        ]);
        $reference = trim($data['reference']);

        if (AbonnementPaiement::where('user_id', $u->id)->where('statut', 'en_attente')->exists()) {
            return response()->json(['message' => 'Vous avez déjà une demande en attente de validation.'], 422);
        }
        if (AbonnementPaiement::where('reference', $reference)->whereIn('statut', ['en_attente', 'valide'])->exists()) {
            return response()->json(['message' => 'Cette référence de paiement a déjà été utilisée.'], 422);
        }

        $paiement = AbonnementPaiement::create([
            'user_id'      => $u->id,
            'numero_envoi' => trim($data['numero_envoi']),
            'reference'    => $reference,
            'paye_le'      => !empty($data['paye_le']) ? Carbon::parse($data['paye_le']) : now(),
            'montant'      => (int) $data['montant'],
            'statut'       => 'en_attente',
        ]);

        foreach (User::where('role', 'admin')->get() as $admin) {
            $this->notifier($admin->id,
                "💳 Paiement à valider : {$u->prenom} {$u->nom} — {$data['montant']} Ar — réf. {$reference} — depuis {$data['numero_envoi']}", 'info');
        }

        return response()->json([
            'message'  => 'Paiement envoyé. Il sera validé par l\'administrateur.',
            'paiement' => $paiement,
        ], 201);
    }

    // ── Admin : liste des paiements ────────────────────
    public function liste(Request $request)
    {
        $this->admin();

        $q = AbonnementPaiement::with('coursier:id,nom,prenom,telephone,statut,abonnement_expire')
            ->orderByRaw("CASE statut WHEN 'en_attente' THEN 0 ELSE 1 END")
            ->orderByDesc('created_at');

        if ($request->filled('statut')) {
            $q->where('statut', $request->statut);
        }

        return response()->json($q->limit(200)->get());
    }

    // ── Admin : valider un paiement (ne reactive PAS le compte) ──
    public function valider($id)
    {
        $admin = $this->admin();
        $p = AbonnementPaiement::with('coursier')->findOrFail($id);

        if ($p->statut !== 'en_attente') {
            return response()->json(['message' => 'Ce paiement a déjà été traité.'], 422);
        }

        $c = $p->coursier;
        $actuelle = $c->abonnement_expire ? Carbon::parse($c->abonnement_expire) : null;
        $nouvelle = $actuelle ? $actuelle->copy() : Carbon::parse($c->created_at)->addDays(30);
        do { $nouvelle = $nouvelle->copy()->addMonthNoOverflow(); } while ($nouvelle->isPast());
        $c->abonnement_expire = $nouvelle->endOfDay();
        $c->save();

        $p->update(['statut' => 'valide', 'traite_par' => $admin->id, 'traite_le' => now(), 'motif_rejet' => null]);

        $this->notifier($c->id, $c->statut === 'suspendu'
            ? "✅ Votre paiement d'abonnement est validé. L'administrateur va réactiver votre compte."
            : "✅ Votre paiement d'abonnement est validé. Abonnement prolongé d'un mois.", 'success');

        return response()->json([
            'message'           => 'Paiement validé. Le compte doit être réactivé par un clic.',
            'abonnement_expire' => $c->abonnement_expire,
            'statut_coursier'   => $c->statut,
        ]);
    }

    // ── Admin : rejeter un paiement ────────────────────
    public function rejeter(Request $request, $id)
    {
        $admin = $this->admin();
        $data = $request->validate(['motif' => 'required|string|max:200']);
        $p = AbonnementPaiement::findOrFail($id);

        if ($p->statut !== 'en_attente') {
            return response()->json(['message' => 'Ce paiement a déjà été traité.'], 422);
        }

        $p->update(['statut' => 'rejete', 'motif_rejet' => $data['motif'], 'traite_par' => $admin->id, 'traite_le' => now()]);

        $this->notifier($p->user_id, "❌ Paiement d'abonnement rejeté : {$data['motif']}", 'error');

        return response()->json(['message' => 'Paiement rejeté.']);
    }

    // ── Admin : reactiver un coursier suspendu (clic manuel) ──
    public function reactiver($id)
    {
        $this->admin();
        $c = User::where('role', 'coursier')->findOrFail($id);

        if (!$c->abonnement_expire || Carbon::parse($c->abonnement_expire)->isPast()) {
            return response()->json(['message' => "Abonnement échu : validez d'abord un paiement."], 422);
        }

        $c->statut = 'actif';
        $c->save();

        $this->notifier($c->id, "🎉 Votre compte est réactivé. Vous pouvez de nouveau prendre des missions.", 'success');

        return response()->json(['message' => 'Compte réactivé.', 'statut' => $c->statut]);
    }

    // ── Admin : modifier l'echeance a la main ──────────
    public function echeance(Request $request, $id)
    {
        $this->admin();
        $data = $request->validate(['date' => 'required|date']);
        $c = User::where('role', 'coursier')->findOrFail($id);

        $c->abonnement_expire = Carbon::parse($data['date']);
        $c->save();

        return response()->json(['message' => 'Échéance mise à jour.', 'abonnement_expire' => $c->abonnement_expire]);
    }
}
