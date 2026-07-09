<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

// ── Publiques ────────────────────────────────────
Route::post('/register',        [AuthController::class, 'register']);
Route::post('/login',           [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::get ('/verifier-statut-coursier/{id}', [AuthController::class, 'verifierStatutCoursier']);
Route::get ('/moyens-transport', [AdminController::class, 'moyensTransportPublic']);

// ── Authentifiées (JWT requis) ───────────────────
Route::middleware('auth:api')->group(function () {

    Route::get ('/me',     [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // ── ADMIN — toutes les routes admin sont ICI dans le groupe ──
    Route::prefix('admin')->group(function () {

        // Dashboard
        Route::get('/stats',                 [AdminController::class, 'stats']);
        Route::get('/commandes-mensuelles',  [AdminController::class, 'commandesMensuelles']);
        Route::get('/services-populaires',   [AdminController::class, 'servicesPopulaires']);
        Route::get('/dernieres-commandes',   [AdminController::class, 'dernieresCommandes']);
        Route::get('/historique', [AdminController::class, 'historique']);
        

        // Clients & Coursiers
        Route::get   ('/clients',                [AdminController::class, 'clients']);
        Route::post  ('/clients',                [AdminController::class, 'creerClient']);
        Route::post('/coursiers', [AdminController::class, 'creerCoursier']);
        Route::get   ('/coursiers',              [AdminController::class, 'coursiers']);
        Route::post  ('/toggle-statut/{id}',     [AdminController::class, 'toggleStatut']);
        Route::put   ('/users/{id}',             [AdminController::class, 'modifierUser']);
        Route::delete('/users/{id}',             [AdminController::class, 'deleteUser']);

        // Notifications
        Route::get   ('/notifications',          [AdminController::class, 'notificationsAdmin']);
        Route::post  ('/notifications/tous-lus', [AdminController::class, 'marquerTousLusAdmin']);
        Route::delete('/notifications/{id}',     [AdminController::class, 'deleteNotif']);

        // Coursiers en attente
        Route::get ('/coursiers-en-attente',     [AdminController::class, 'coursiersEnAttente']);
        Route::post('/valider-coursier/{id}',    [AdminController::class, 'validerCoursier']);
        Route::post('/rejeter-coursier/{id}',    [AdminController::class, 'rejeterCoursier']);

        // Admins CRUD
        Route::get   ('/admins',                 [AdminController::class, 'admins']);
        Route::post  ('/admins',                 [AdminController::class, 'creerAdmin']);
        Route::put   ('/admins/{id}',            [AdminController::class, 'modifierAdmin']);
        Route::delete('/admins/{id}',            [AdminController::class, 'supprimerAdmin']);

        // Tarifs CRUD ✅ maintenant dans le groupe auth
        Route::get   ('/tarifs',                 [AdminController::class, 'tarifs']);
        Route::post  ('/tarifs',                 [AdminController::class, 'creerTarif']);
        Route::put   ('/tarifs/{id}',            [AdminController::class, 'modifierTarif']);
        Route::delete('/tarifs/{id}',            [AdminController::class, 'supprimerTarif']);

        // Moyens de transport CRUD ✅ maintenant dans le groupe auth
        Route::get   ('/moyens-transport',       [AdminController::class, 'moyensTransport']);
        Route::post  ('/moyens-transport',       [AdminController::class, 'creerMoyenTransport']);
        Route::put   ('/moyens-transport/{id}',  [AdminController::class, 'modifierMoyenTransport']);
        Route::delete('/moyens-transport/{id}',  [AdminController::class, 'supprimerMoyenTransport']);

        // Commandes CRUD admin ✅ nouvelles routes
        Route::get   ('/commandes',              [AdminController::class, 'toutesCommandes']);
        Route::post  ('/commandes',              [AdminController::class, 'ajouterCommande']);
        Route::get   ('/commandes/{id}',         [AdminController::class, 'uneCommande']);
        Route::put   ('/commandes/{id}',         [AdminController::class, 'modifierCommande']);
        Route::delete('/commandes/{id}',         [AdminController::class, 'supprimerCommande']);
    });

    // ── Commandes (client/coursier) ──────────────
    Route::post('/commandes',                          [CommandeController::class, 'store']);
    Route::get ('/commandes/mes-commandes',            [CommandeController::class, 'mesCommandes']);
    Route::get ('/commandes/disponibles',              [CommandeController::class, 'disponibles']);
    Route::get ('/commandes/mes-missions',             [CommandeController::class, 'mesMissions']);
    Route::post  ('/commandes/{id}/prendre',           [CommandeController::class, 'prendre']);
    Route::post  ('/commandes/{id}/accepter-client',   [CommandeController::class, 'accepterParClient']);
    Route::post  ('/commandes/{id}/accepter-coursier', [CommandeController::class, 'accepterParCoursier']);
    Route::post  ('/commandes/{id}/refuser',           [CommandeController::class, 'refuser']);
    Route::post  ('/commandes/{id}/terminer',          [CommandeController::class, 'terminer']);
    Route::delete('/commandes/{id}',                   [CommandeController::class, 'destroy']);

    // ── Messages ─────────────────────────────────
    Route::get   ('/commandes/{id}/messages',                       [MessageController::class, 'index']);
    Route::post  ('/commandes/{id}/messages',                       [MessageController::class, 'store']);
    Route::delete('/commandes/{commandeId}/messages/{messageId}',   [MessageController::class, 'destroy']);
    Route::put   ('/commandes/{commandeId}/messages/{messageId}',   [MessageController::class, 'update']);

    // ── Notifications (client/coursier) ──────────
    Route::post  ('/notifications/tous-lus',  [NotificationController::class, 'marquerTousLus']);
    Route::get   ('/notifications',           [NotificationController::class, 'index']);
    Route::post  ('/notifications/{id}/lu',   [NotificationController::class, 'marquerLu']);
    Route::delete('/notifications/{id}',      [NotificationController::class, 'destroy']);
});