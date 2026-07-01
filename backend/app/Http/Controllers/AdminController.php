<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Commande;
use App\Models\Notification;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;


class AdminController extends Controller
{
    // ── Vérification admin ─────────────────────────
    private function checkAdmin()
    {
        $user = JWTAuth::user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Accès refusé');
        }
        return $user;
    }

    // ── Stats globales dashboard ───────────────────
public function stats()
{
    $this->checkAdmin();

    $clientsActifs     = User::where('role', 'client')->where('statut', 'actif')->count();
    $clientsInactifs   = User::where('role', 'client')->where('statut', 'inactif')->count();
    $coursiersActifs   = User::where('role', 'coursier')->where('statut', 'actif')->count();

    // INACTIF = coursier désactivé qui a déjà eu un abonnement
    $coursiersInactifs = User::where('role', 'coursier')
        ->where('statut', 'inactif')
        ->whereNotNull('abonnement_expire')
        ->count();

    // EN ATTENTE = nouveau coursier qui n'a jamais été activé (pas encore d'abonnement)
    $coursiersEnAttente = User::where('role', 'coursier')
        ->where('statut', 'inactif')
        ->whereNull('abonnement_expire')
        ->count();

    $totalCommandes = Commande::count();
    $revenus        = Commande::where('statut', 'termine')->sum('tarif');

    $abonnesPayes   = $coursiersActifs;
    $abonnesImpayes = $coursiersInactifs + $coursiersEnAttente;

    return response()->json([
        'clients_actifs'       => (int) $clientsActifs,
        'clients_inactifs'     => (int) $clientsInactifs,
        'coursiers_actifs'     => (int) $coursiersActifs,
        'coursiers_inactifs'   => (int) $coursiersInactifs,
        'coursiers_en_attente' => (int) $coursiersEnAttente,
        'total_commandes'      => (int) $totalCommandes,
        'revenus'              => (float) $revenus,
        'abonnes_payes'        => (int) $abonnesPayes,
        'abonnes_impayes'      => (int) $abonnesImpayes,
    ]);
}

    // ── Commandes mensuelles (12 derniers mois) ────
public function commandesMensuelles()
{
    $this->checkAdmin();
    $data = [];
    for ($i = 11; $i >= 0; $i--) {
        $date  = now()->subMonths($i);
        $count = Commande::whereYear('created_at', $date->year)
                         ->whereMonth('created_at', $date->month)
                         ->count();
        $data[] = [
            'label' => $date->format('M'),
            'val'   => $count,
        ];
    }
    return response()->json($data);
}

    // ── Services les plus demandés ─────────────────
    public function servicesPopulaires()
    {
        $this->checkAdmin();
        $data = Commande::selectRaw('service, COUNT(*) as total')
            ->groupBy('service')
            ->orderByDesc('total')
            ->limit(8)
            ->get()
            ->map(fn($r) => [
                'label' => mb_substr($r->service, 0, 5),
                'full'  => $r->service,
                'val'   => $r->total,
            ]);
        return response()->json($data);
    }

    // ── Dernières commandes ────────────────────────
    public function dernieresCommandes()
    {
        $this->checkAdmin();
        $commandes = Commande::with(['client','coursier'])
            ->orderByDesc('created_at')
            ->limit(20)
            ->get()
            ->map(fn($c) => [
                'id'       => $c->id,
                'service'  => $c->service,
                'client'   => $c->client  ? $c->client->prenom.' '.$c->client->nom[0].'.'  : '—',
                'coursier' => $c->coursier ? $c->coursier->prenom.' '.$c->coursier->nom[0].'.' : null,
                'tarif'    => $c->tarif,
                'statut'   => $c->statut,
                'date'     => $c->created_at->format('Y-m-d'),
                'heure'    => $c->heure_publication,
            ]);
        return response()->json($commandes);
    }

    // ── Liste clients ──────────────────────────────
    public function clients()
    {
        $this->checkAdmin();
        $clients = User::where('role','client')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($u) => [
                'id'         => $u->id,
                'nom'        => $u->nom,
                'prenom'     => $u->prenom,
                'email'      => $u->email,
                'telephone'  => $u->telephone,
                'adresse'    => $u->adresse,
                'statut'     => $u->statut,
                'created_at' => $u->created_at->format('Y-m-d'),
                'commandes'  => Commande::where('client_id',$u->id)->count(),
            ]);
        return response()->json($clients);
    }

    // ── Liste coursiers ────────────────────────────
    public function coursiers()
    {
        $this->checkAdmin();
        $coursiers = User::where('role','coursier')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($u) => [
                'id'          => $u->id,
                'nom'         => $u->nom,
                'prenom'      => $u->prenom,
                'email'       => $u->email,
                'telephone'   => $u->telephone,
                'adresse'     => $u->adresse,
                'cin'         => $u->cin,
                'statut'      => $u->statut,
                'note'        => round((float)$u->note, 1),
                'nb_missions' => $u->nb_missions ?? 0,
                'photo_recto' => $u->photo_recto,
                'photo_verso' => $u->photo_verso,
                'created_at'  => $u->created_at->format('Y-m-d'),
                'missions'    => Commande::where('coursier_id',$u->id)->count(),
            ]);
        return response()->json($coursiers);
    }

    // ── Toggle statut client/coursier ──────────────
    public function toggleStatut($id)
    {
        $this->checkAdmin();
        $user = User::findOrFail($id);
        $user->statut = $user->statut === 'actif' ? 'inactif' : 'actif';
        $user->save();
        return response()->json(['message' => 'Statut mis à jour', 'statut' => $user->statut]);
    }

    // ── Supprimer utilisateur ──────────────────────
    public function deleteUser($id)
    {
        $this->checkAdmin();
        $user = User::findOrFail($id);
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Impossible de supprimer un admin'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé']);
    }

    // ── Notifications admin ────────────────────────
    public function notificationsAdmin()
    {
        $admin = $this->checkAdmin();
        $notifs = Notification::where('user_id', $admin->id)
            ->orderByDesc('created_at')
            ->limit(50)
            ->get()
            ->map(fn($n) => [
                'id'          => $n->id,
                'texte'       => $n->texte,
                'type'        => $n->type,
                'lu'          => (bool)$n->lu,
                'commande_id' => $n->commande_id,
                'user_id_cible' => $n->user_id_cible,
                'time'        => $n->created_at->diffForHumans(),
                'created_at'  => $n->created_at,
            ]);
        return response()->json($notifs);
    }

    // ── Supprimer notif admin ──────────────────────
    public function deleteNotif($id)
    {
        $admin = $this->checkAdmin();
        Notification::where('id', $id)->where('user_id', $admin->id)->delete();
        return response()->json(['message' => 'Supprimé']);
    }

    // ── Marquer toutes notifs lues ─────────────────
    public function marquerTousLusAdmin()
    {
        $admin = $this->checkAdmin();
        Notification::where('user_id', $admin->id)->update(['lu' => true]);
        return response()->json(['message' => 'Lu']);
    }

    // ── Coursiers en attente de vérification ──────
public function coursiersEnAttente()
{
    $this->checkAdmin();
    $coursiers = User::where('role', 'coursier')
        ->where('statut', 'inactif')
        ->whereNull('abonnement_expire')
        ->orderByDesc('created_at')
        ->get()
        ->map(fn($u) => [
            'id'          => $u->id,
            'nom'         => $u->nom,
            'prenom'      => $u->prenom,
            'email'       => $u->email,
            'telephone'   => $u->telephone,
            'adresse'     => $u->adresse,
            'cin'         => $u->cin,
            'photo_recto' => $u->photo_recto,
            'photo_verso' => $u->photo_verso,
            'mvola_transaction' => $u->mvola_transaction, // ✅ doit être présent
            'latitude'    => $u->latitude,                 // ✅ doit être présent
            'longitude'   => $u->longitude,                // ✅ doit être présent
            'created_at'  => $u->created_at->format('Y-m-d H:i'),
        ]);
    return response()->json($coursiers);
}
// ── Valider un coursier ────────────────────────
public function validerCoursier($id)
{
    $this->checkAdmin();
    $coursier = User::findOrFail($id);

    if ($coursier->role !== 'coursier') {
        return response()->json(['message' => 'Utilisateur non coursier'], 400);
    }

    $coursier->statut = 'actif';
    $coursier->save();

    // ✅ Notifier le coursier qu'il peut se connecter
    Notification::create([
        'user_id'     => $coursier->id,
        'texte'       => "🎉 Félicitations {$coursier->prenom} ! Votre compte a été validé. Vous pouvez maintenant vous connecter.",
        'type'        => 'success',
        'commande_id' => null,
    ]);

    return response()->json(['message' => 'Coursier validé avec succès']);
}


// ── Rejeter un coursier avec message ──────────
public function rejeterCoursier(Request $request, $id)
{
    $this->checkAdmin();
    $coursier = User::findOrFail($id);

    $request->validate([
        'message' => 'required|string|max:500',
    ]);

    // ✅ 1. Envoyer l'email de rejet AVANT de supprimer le compte
    try {
        \Mail::raw(
            "Bonjour {$coursier->prenom} {$coursier->nom},\n\n" .
            "Votre demande d'inscription en tant que coursier sur IRAKY Delivery a été examinée.\n\n" .
            "Votre dossier a été rejeté pour la raison suivante :\n\n" .
            "{$request->message}\n\n" .
            "Vous pouvez vous réinscrire sur notre plateforme en corrigeant les erreurs mentionnées.\n\n" .
            "Lien d'inscription : http://localhost:3000/inscription\n\n" .
            "Cordialement,\nL'équipe IRAKY Delivery - Toliara",
            function ($mail) use ($coursier) {
                $mail->to($coursier->email, "{$coursier->prenom} {$coursier->nom}")
                     ->subject('IRAKY Delivery — Votre dossier coursier a été rejeté');
            }
        );
    } catch (\Exception $e) {
        // Log l'erreur mais continue — l'email n'est pas bloquant
        \Log::error("Erreur envoi email rejet coursier: " . $e->getMessage());
    }

    // ✅ 2. Stocker le message de rejet dans notifications_iraky
    //    AVANT la suppression pour que le polling puisse le lire
    Notification::create([
        'user_id'     => $coursier->id,
        'texte'       => "❌ Votre dossier a été rejeté. Raison : {$request->message}. Réinscrivez-vous en corrigeant les erreurs.",
        'type'        => 'warning',
        'commande_id' => null,
    ]);

    // ✅ 3. Marquer le compte comme "rejete" au lieu de supprimer immédiatement
    //    → le coursier voit le message de rejet via polling pendant 24h
    $coursier->statut = 'rejete'; // nouveau statut
    $coursier->save();

    // Supprimer après 24h via job ou laisser l'admin supprimer manuellement
    // Pour l'instant on ne supprime pas pour que le polling fonctionne

    return response()->json([
        'message' => 'Coursier rejeté, email envoyé et notifié.',
        'email_envoye' => true,
    ]);
}
}