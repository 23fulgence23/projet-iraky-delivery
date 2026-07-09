<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Commande;
use App\Models\Notification;
use App\Models\Tarif;
use App\Models\MoyenTransport;
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

    public function admins()
    {
        $admin = $this->checkAdmin();
 
        $admins = User::where('role', 'admin')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($u) => [
                'id'         => $u->id,
                'nom'        => $u->nom,
                'prenom'     => $u->prenom,
                'email'      => $u->email,
                'telephone'  => $u->telephone,
                'created_at' => $u->created_at->format('Y-m-d'),
                'est_moi'    => $u->id === $admin->id,
            ]);
 
        return response()->json($admins);
    }
 
    // ── Créer un admin ──────────────────────────────
    public function creerAdmin(Request $request)
    {
        $this->checkAdmin();

        // ✅ Limite : 3 administrateurs maximum
        $nbAdmins = User::where('role', 'admin')->count();
        if ($nbAdmins >= 3) {
            return response()->json([
                'message' => 'Le nombre maximum de 3 administrateurs est déjà atteint.',
            ], 403);
        }

        $request->validate([
            'nom'       => 'required|string|max:100',
            'prenom'    => 'required|string|max:100',
            'email'     => 'required|email|unique:users,email',
            'telephone' => 'nullable|string|max:20',
            'password'  => 'required|string|min:6',
        ], [
            // ✅ Messages personnalisés — évite d'afficher la clé brute
            // "validation.unique" si les fichiers de langue Laravel ne
            // sont pas publiés sur le serveur (courant depuis Laravel 9+).
            'nom.required'      => 'Le nom est obligatoire.',
            'prenom.required'   => 'Le prénom est obligatoire.',
            'email.required'    => 'L\'email est obligatoire.',
            'email.email'       => 'L\'email n\'est pas valide.',
            'email.unique'      => 'Cet email est déjà utilisé par un autre compte.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min'      => 'Le mot de passe doit contenir au moins 6 caractères.',
        ]);

        // ✅ Assignation explicite (et non User::create([...])) pour éviter
        // que 'role' et 'statut' soient silencieusement ignorés si le modèle
        // User ne les autorise pas dans $fillable (protection anti mass-assignment,
        // très courante pour empêcher qu'un simple inscrit s'auto-déclare admin).
        // C'est très probablement la cause du "je n'arrive pas à ajouter d'admin" :
        // le compte était créé, mais sans role='admin', donc invisible dans la liste.
        $admin = new User();
        $admin->nom       = $request->nom;
        $admin->prenom    = $request->prenom;
        $admin->email     = $request->email;
        $admin->telephone = $request->telephone;
        $admin->adresse   = $request->adresse ?: 'Toliara, Madagascar'; // ✅ colonne NOT NULL en base
        $admin->password  = bcrypt($request->password);
        $admin->role      = 'admin';
        $admin->statut    = 'actif';
        $admin->save();

        return response()->json([
            'message' => 'Admin créé avec succès',
            'admin'   => $admin,
        ], 201);
    }
 
    // ── Modifier un admin ───────────────────────────
    public function modifierAdmin(Request $request, $id)
    {
        $this->checkAdmin();
        $admin = User::where('role', 'admin')->findOrFail($id);
 
        $request->validate([
            'nom'       => 'required|string|max:100',
            'prenom'    => 'required|string|max:100',
            'email'     => 'required|email|unique:users,email,' . $id,
            'telephone' => 'nullable|string|max:20',
            'password'  => 'nullable|string|min:6',
        ], [
            'nom.required'      => 'Le nom est obligatoire.',
            'prenom.required'   => 'Le prénom est obligatoire.',
            'email.required'    => 'L\'email est obligatoire.',
            'email.email'       => 'L\'email n\'est pas valide.',
            'email.unique'      => 'Cet email est déjà utilisé par un autre compte.',
            'password.min'      => 'Le mot de passe doit contenir au moins 6 caractères.',
        ]);
 
        $admin->nom       = $request->nom;
        $admin->prenom    = $request->prenom;
        $admin->email     = $request->email;
        $admin->telephone = $request->telephone;
 
        if ($request->filled('password')) {
            $admin->password = bcrypt($request->password);
        }
 
        $admin->save();
 
        return response()->json([
            'message' => 'Admin modifié avec succès',
            'admin'   => $admin,
        ]);
    }
 
    // ── Supprimer un admin ──────────────────────────
    public function supprimerAdmin($id)
    {
        $moi = $this->checkAdmin();
 
        if ((int) $moi->id === (int) $id) {
            return response()->json([
                'message' => 'Impossible de supprimer votre propre compte',
            ], 403);
        }
 
        $admin = User::where('role', 'admin')->findOrFail($id);
        $admin->delete();
 
        return response()->json(['message' => 'Admin supprimé avec succès']);
    }

    public function tarifs()
    {
        $this->checkAdmin();
        return response()->json(Tarif::orderBy('id')->get());
    }
 
    // ── Créer un tarif ───────────────────────────────
    public function creerTarif(Request $request)
    {
        $this->checkAdmin();
 
        $request->validate([
            'service'     => 'required|string|max:100',
            'label'       => 'required|string|max:150',
            'prix_base'   => 'required|numeric|min:0',
            'prix_km'     => 'nullable|numeric|min:0',
            'description' => 'nullable|string|max:255',
        ], [
            'service.required'   => 'Le service est obligatoire.',
            'label.required'     => 'Le libellé est obligatoire.',
            'prix_base.required' => 'Le prix de base est obligatoire.',
            'prix_base.numeric'  => 'Le prix de base doit être un nombre.',
            'prix_km.numeric'    => 'Le prix par km doit être un nombre.',
        ]);
 
        $tarif = new Tarif();
        $tarif->service     = $request->service;
        $tarif->label       = $request->label;
        $tarif->prix_base   = $request->prix_base;
        $tarif->prix_km     = $request->prix_km;
        $tarif->description = $request->description;
        $tarif->save();
 
        return response()->json(['message' => 'Tarif créé avec succès', 'tarif' => $tarif], 201);
    }
 
    // ── Modifier un tarif ────────────────────────────
    public function modifierTarif(Request $request, $id)
    {
        $this->checkAdmin();
        $tarif = Tarif::findOrFail($id);
 
        $request->validate([
            'service'     => 'required|string|max:100',
            'label'       => 'required|string|max:150',
            'prix_base'   => 'required|numeric|min:0',
            'prix_km'     => 'nullable|numeric|min:0',
            'description' => 'nullable|string|max:255',
        ], [
            'service.required'   => 'Le service est obligatoire.',
            'label.required'     => 'Le libellé est obligatoire.',
            'prix_base.required' => 'Le prix de base est obligatoire.',
            'prix_base.numeric'  => 'Le prix de base doit être un nombre.',
            'prix_km.numeric'    => 'Le prix par km doit être un nombre.',
        ]);
 
        $tarif->service     = $request->service;
        $tarif->label       = $request->label;
        $tarif->prix_base   = $request->prix_base;
        $tarif->prix_km     = $request->prix_km;
        $tarif->description = $request->description;
        $tarif->save();
 
        return response()->json(['message' => 'Tarif modifié avec succès', 'tarif' => $tarif]);
    }
 
    // ── Supprimer un tarif ───────────────────────────
    public function supprimerTarif($id)
    {
        $this->checkAdmin();
        $tarif = Tarif::findOrFail($id);
        $tarif->delete();
        return response()->json(['message' => 'Tarif supprimé avec succès']);
    }
        public function moyensTransport()
    {
        $this->checkAdmin();
        return response()->json(MoyenTransport::orderBy('prix')->get());
    }
 
    // ── Créer un moyen de transport ──────────────────
    public function creerMoyenTransport(Request $request)
    {
        $this->checkAdmin();
 
        $request->validate([
            'nom'           => 'required|string|max:100',
            'icone'         => 'nullable|string|max:10',
            'prix'          => 'required|numeric|min:0',
            'duree_estimee' => 'nullable|integer|min:0',
        ], [
            'nom.required'  => 'Le nom est obligatoire.',
            'prix.required' => 'Le prix est obligatoire.',
            'prix.numeric'  => 'Le prix doit être un nombre.',
        ]);
 
        $moyen = new MoyenTransport();
        $moyen->nom           = $request->nom;
        $moyen->icone         = $request->icone;
        $moyen->prix          = $request->prix;
        $moyen->duree_estimee = $request->duree_estimee;
        $moyen->save();
 
        return response()->json(['message' => 'Moyen de transport créé avec succès', 'moyen' => $moyen], 201);
    }
 
    // ── Modifier un moyen de transport ───────────────
    public function modifierMoyenTransport(Request $request, $id)
    {
        $this->checkAdmin();
        $moyen = MoyenTransport::findOrFail($id);
 
        $request->validate([
            'nom'           => 'required|string|max:100',
            'icone'         => 'nullable|string|max:10',
            'prix'          => 'required|numeric|min:0',
            'duree_estimee' => 'nullable|integer|min:0',
        ], [
            'nom.required'  => 'Le nom est obligatoire.',
            'prix.required' => 'Le prix est obligatoire.',
            'prix.numeric'  => 'Le prix doit être un nombre.',
        ]);
 
        $moyen->nom           = $request->nom;
        $moyen->icone         = $request->icone;
        $moyen->prix          = $request->prix;
        $moyen->duree_estimee = $request->duree_estimee;
        $moyen->save();
 
        return response()->json(['message' => 'Moyen de transport modifié avec succès', 'moyen' => $moyen]);
    }
 
    // ── Supprimer un moyen de transport ──────────────
    public function supprimerMoyenTransport($id)
    {
        $this->checkAdmin();
        $moyen = MoyenTransport::findOrFail($id);
        $moyen->delete();
        return response()->json(['message' => 'Moyen de transport supprimé avec succès']);
    }
    public function moyensTransportPublic()
    {
        return response()->json(\App\Models\MoyenTransport::orderBy('prix')->get());
    }

    // ══════════════════════════════════════════════
    //  CRUD COMMANDES ADMIN
    // ══════════════════════════════════════════════

    public function toutesCommandes()
    {
        $this->checkAdmin();
        return response()->json(
            Commande::with(['client','coursier'])
                ->orderByDesc('created_at')
                ->get()
                ->map(fn($c) => [
                    'id'             => $c->id,
                    'service'        => $c->service,
                    'detail'         => $c->detail,
                    'adresse_pickup' => $c->adresse_pickup,
                    'moyen'          => $c->moyen,
                    'tarif'          => (float)$c->tarif,
                    'statut'         => $c->statut,
                    'client_id'      => $c->client_id,
                    'coursier_id'    => $c->coursier_id,
                    'client'         => $c->client   ? $c->client->prenom.' '.$c->client->nom   : '—',
                    'coursier'       => $c->coursier ? $c->coursier->prenom.' '.$c->coursier->nom : null,
                    'date'           => $c->created_at->format('Y-m-d'),
                    'heure'          => $c->heure_publication,
                ])
        );
    }

    public function ajouterCommande(Request $request)
    {
        $this->checkAdmin();
        $request->validate([
            'client_id'         => 'required|exists:users,id',
            'service'           => 'required|string|max:255',
            'moyen'             => 'required|string|max:100',
            'tarif'             => 'required|numeric|min:0',
            'detail'            => 'nullable|string|max:500',
            'adresse_pickup'    => 'nullable|string|max:255',
            'heure_publication' => 'nullable|string',
            'heure_debut'       => 'nullable|string',
            'heure_livraison'   => 'nullable|string',
            'statut'            => 'nullable|in:en_attente,negociable,accepte,refuse,termine',
        ]);

        $commande = Commande::create([
            'client_id'         => $request->client_id,
            'coursier_id'       => $request->coursier_id ?? null,
            'service'           => $request->service,
            'moyen'             => $request->moyen,
            'tarif'             => $request->tarif,
            'detail'            => $request->detail ?? '',
            'adresse_pickup'    => $request->adresse_pickup ?? '',
            'heure_publication' => $request->heure_publication ?? now()->format('H:i'),
            'heure_debut'       => $request->heure_debut ?? now()->format('H:i'),
            'heure_livraison'   => $request->heure_livraison ?? now()->addHour()->format('H:i'),
            'statut'            => $request->statut ?? 'en_attente',
            'accord_client'     => false,
            'accord_coursier'   => false,
        ]);

        // Notifier le client
        Notification::create([
            'user_id'     => $commande->client_id,
            'texte'       => "📦 Une commande a été créée pour vous par l'administrateur : {$commande->service}",
            'type'        => 'info',
            'commande_id' => $commande->id,
        ]);

        return response()->json(['message' => 'Commande créée', 'commande' => $commande], 201);
    }

    public function modifierCommande(Request $request, $id)
    {
        $this->checkAdmin();
        $commande = Commande::findOrFail($id);

        $request->validate([
            'service'        => 'nullable|string|max:255',
            'moyen'          => 'nullable|string|max:100',
            'tarif'          => 'nullable|numeric|min:0',
            'detail'         => 'nullable|string|max:500',
            'adresse_pickup' => 'nullable|string|max:255',
            'statut'         => 'nullable|in:en_attente,negociable,accepte,refuse,termine',
            'coursier_id'    => 'nullable|exists:users,id',
        ]);

        $commande->fill($request->only([
            'service','moyen','tarif','detail','adresse_pickup','statut','coursier_id'
        ]));
        $commande->save();

        // Notifier client et coursier
        $texte = "⚙️ Votre commande #{$commande->id} ({$commande->service}) a été modifiée par l'administrateur.";
        Notification::create(['user_id' => $commande->client_id, 'texte' => $texte, 'type' => 'info', 'commande_id' => $commande->id]);
        if ($commande->coursier_id) {
            Notification::create(['user_id' => $commande->coursier_id, 'texte' => $texte, 'type' => 'info', 'commande_id' => $commande->id]);
        }

        return response()->json(['message' => 'Commande modifiée', 'commande' => $commande]);
    }

    public function supprimerCommande($id)
    {
        $this->checkAdmin();
        $commande = Commande::findOrFail($id);

        $texte = "🗑️ Votre commande #{$commande->id} ({$commande->service}) a été supprimée par l'administrateur.";
        Notification::create(['user_id' => $commande->client_id, 'texte' => $texte, 'type' => 'warning', 'commande_id' => null]);
        if ($commande->coursier_id) {
            Notification::create(['user_id' => $commande->coursier_id, 'texte' => $texte, 'type' => 'warning', 'commande_id' => null]);
        }

        $commande->delete();
        return response()->json(['message' => 'Commande supprimée']);
    }
     // ── Créer un client ──────────────────────────────
    public function creerClient(Request $request)
    {
        $this->checkAdmin();
 
        $request->validate([
            'nom'       => 'required|string|max:100',
            'prenom'    => 'required|string|max:100',
            'email'     => 'required|email|unique:users,email',
            'telephone' => 'nullable|string|max:20',
            'adresse'   => 'nullable|string|max:255',
            'cin'       => 'nullable|string|max:20',
            'password'  => 'required|string|min:6',
        ], [
            'nom.required'      => 'Le nom est obligatoire.',
            'prenom.required'   => 'Le prénom est obligatoire.',
            'email.required'    => 'L\'email est obligatoire.',
            'email.email'       => 'L\'email n\'est pas valide.',
            'email.unique'      => 'Cet email est déjà utilisé par un autre compte.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min'      => 'Le mot de passe doit contenir au moins 6 caractères.',
        ]);
 
        $client = new User();
        $client->nom       = $request->nom;
        $client->prenom    = $request->prenom;
        $client->email     = $request->email;
        $client->telephone = $request->telephone;
        $client->adresse   = $request->adresse ?: 'Toliara, Madagascar'; // colonne NOT NULL
        $client->password  = bcrypt($request->password);
        $client->role      = 'client';
        $client->statut    = 'actif';
        $client->save();
 
        return response()->json([
            'message' => 'Client créé avec succès',
            'user'    => $client,
        ], 201);
    }
 
    // ── Modifier un client OU un coursier ─────────────
    // (route déjà déclarée : PUT /admin/users/{id})
    public function modifierUser(Request $request, $id)
    {
        $this->checkAdmin();
        $user = User::findOrFail($id);
 
        $request->validate([
            'nom'       => 'required|string|max:100',
            'prenom'    => 'required|string|max:100',
            'email'     => 'required|email|unique:users,email,' . $id,
            'telephone' => 'nullable|string|max:20',
            'adresse'   => 'nullable|string|max:255',
            'cin'       => 'nullable|string|max:20',
            'password'  => 'nullable|string|min:6',
        ], [
            'nom.required'      => 'Le nom est obligatoire.',
            'prenom.required'   => 'Le prénom est obligatoire.',
            'email.required'    => 'L\'email est obligatoire.',
            'email.email'       => 'L\'email n\'est pas valide.',
            'email.unique'      => 'Cet email est déjà utilisé par un autre compte.',
            'password.min'      => 'Le mot de passe doit contenir au moins 6 caractères.',
        ]);
 
        $user->nom       = $request->nom;
        $user->prenom    = $request->prenom;
        $user->email     = $request->email;
        $user->telephone = $request->telephone;
        if ($request->filled('adresse')) $user->adresse = $request->adresse;
        if ($request->filled('cin'))     $user->cin     = $request->cin;
        if ($request->filled('password')) $user->password = bcrypt($request->password);
        $user->save();
 
        return response()->json([
            'message' => 'Utilisateur modifié avec succès',
            'user'    => $user,
        ]);
    }

    // ── Historique / Classements ─────────────────────
    public function historique(Request $request)
    {
        $this->checkAdmin();

        $mois  = $request->query('mois');   // 1-12 ou vide = tous
        $annee = $request->query('annee');  // ex: 2026 ou vide = toutes
        $limM  = (int) ($request->query('limite_missions') ?: 10);
        $limC  = (int) ($request->query('limite_clients') ?: 10);
        $limA  = (int) ($request->query('limite_anciens') ?: 10);

        // ── Top coursiers par missions terminées ─────
        $qCoursiers = Commande::where('statut', 'termine')->whereNotNull('coursier_id');
        if ($mois)  $qCoursiers->whereMonth('created_at', $mois);
        if ($annee) $qCoursiers->whereYear('created_at', $annee);

        $topCoursiers = $qCoursiers->selectRaw('coursier_id, COUNT(*) as nb_missions')
            ->groupBy('coursier_id')
            ->orderByDesc('nb_missions')
            ->limit($limM)
            ->get()
            ->map(function ($row) use ($mois, $annee) {
                $coursier = User::find($row->coursier_id);
                if (!$coursier) return null;

                $qServices = Commande::where('coursier_id', $row->coursier_id)->where('statut', 'termine');
                if ($mois)  $qServices->whereMonth('created_at', $mois);
                if ($annee) $qServices->whereYear('created_at', $annee);
                $services = $qServices->distinct()->pluck('service')->filter()->values();

                return [
                    'id'          => $coursier->id,
                    'nom'         => $coursier->nom,
                    'prenom'      => $coursier->prenom,
                    'note'        => round((float) $coursier->note, 1),
                    'nb_missions' => (int) $row->nb_missions,
                    'services'    => $services,
                ];
            })
            ->filter()
            ->values();

        // ── Top clients par nombre de commandes ──────
        $qClients = Commande::query();
        if ($mois)  $qClients->whereMonth('created_at', $mois);
        if ($annee) $qClients->whereYear('created_at', $annee);

        $topClients = $qClients->selectRaw('client_id, COUNT(*) as nb_commandes')
            ->groupBy('client_id')
            ->orderByDesc('nb_commandes')
            ->limit($limC)
            ->get()
            ->map(function ($row) use ($mois, $annee) {
                $client = User::find($row->client_id);
                if (!$client) return null;

                $qServices = Commande::where('client_id', $row->client_id);
                if ($mois)  $qServices->whereMonth('created_at', $mois);
                if ($annee) $qServices->whereYear('created_at', $annee);
                $services = $qServices->distinct()->pluck('service')->filter()->values();

                return [
                    'id'           => $client->id,
                    'nom'          => $client->nom,
                    'prenom'       => $client->prenom,
                    'nb_commandes' => (int) $row->nb_commandes,
                    'services'     => $services,
                ];
            })
            ->filter()
            ->values();

        // ── Coursiers / Clients les plus anciens ─────
        $anciensCoursiers = User::where('role', 'coursier')
            ->orderBy('created_at', 'asc')
            ->limit($limA)
            ->get(['id', 'nom', 'prenom', 'created_at']);

        $anciensClients = User::where('role', 'client')
            ->orderBy('created_at', 'asc')
            ->limit($limA)
            ->get(['id', 'nom', 'prenom', 'created_at']);

        return response()->json([
            'top_coursiers'     => $topCoursiers,
            'top_clients'       => $topClients,
            'anciens_coursiers' => $anciensCoursiers,
            'anciens_clients'   => $anciensClients,
        ]);
    }

    // ── Créer un coursier (ajout direct par l'admin) ──
    public function creerCoursier(Request $request)
    {
        $this->checkAdmin();

        $request->validate([
            'nom'       => 'required|string|max:100',
            'prenom'    => 'required|string|max:100',
            'email'     => 'required|email|unique:users,email',
            'telephone' => 'nullable|string|max:20',
            'adresse'   => 'nullable|string|max:255',
            'cin'       => 'nullable|string|max:20',
            'password'  => 'required|string|min:6',
        ], [
            'nom.required'      => 'Le nom est obligatoire.',
            'prenom.required'   => 'Le prénom est obligatoire.',
            'email.required'    => 'L\'email est obligatoire.',
            'email.email'       => 'L\'email n\'est pas valide.',
            'email.unique'      => 'Cet email est déjà utilisé par un autre compte.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min'      => 'Le mot de passe doit contenir au moins 6 caractères.',
        ]);

        $coursier = new User();
        $coursier->nom       = $request->nom;
        $coursier->prenom    = $request->prenom;
        $coursier->email     = $request->email;
        $coursier->telephone = $request->telephone;
        $coursier->adresse   = $request->adresse ?: 'Toliara, Madagascar'; // colonne NOT NULL
        $coursier->cin       = $request->cin;
        $coursier->password  = bcrypt($request->password);
        $coursier->role      = 'coursier';
        // ✅ Ajouté directement par l'admin -> actif immédiatement,
        // pas besoin de repasser par la vérification CIN/MVola.
        $coursier->statut    = 'actif';
        $coursier->save();

        return response()->json([
            'message' => 'Coursier créé avec succès',
            'user'    => $coursier,
        ], 201);
    }
    
}