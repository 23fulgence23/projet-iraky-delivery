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
    Route::get('/verifier-statut-coursier/{id}', [AuthController::class, 'verifierStatutCoursier']);

    // ── Authentifiées ────────────────────────────────
    Route::middleware('auth:api')->group(function () {
        Route::get('/me',     [AuthController::class, 'me']);
        Route::post('/logout',[AuthController::class, 'logout']);

        // ── ADMIN ────────────────────────────────────────
Route::prefix('admin')->group(function () {
    Route::get   ('/stats',                    [AdminController::class, 'stats']);
    Route::get   ('/commandes-mensuelles',     [AdminController::class, 'commandesMensuelles']);
    Route::get   ('/services-populaires',      [AdminController::class, 'servicesPopulaires']);
    Route::get   ('/dernieres-commandes',      [AdminController::class, 'dernieresCommandes']);
    Route::get   ('/clients',                  [AdminController::class, 'clients']);
    Route::get   ('/coursiers',                [AdminController::class, 'coursiers']);
    Route::post  ('/toggle-statut/{id}',       [AdminController::class, 'toggleStatut']);
    Route::delete('/users/{id}',               [AdminController::class, 'deleteUser']);
    Route::get   ('/notifications',            [AdminController::class, 'notificationsAdmin']);
    Route::delete('/notifications/{id}',       [AdminController::class, 'deleteNotif']);
    Route::post  ('/notifications/tous-lus',   [AdminController::class, 'marquerTousLusAdmin']);
    Route::get    ('/coursiers-en-attente',        [AdminController::class, 'coursiersEnAttente']);
    Route::post   ('/valider-coursier/{id}',       [AdminController::class, 'validerCoursier']);
    Route::post   ('/rejeter-coursier/{id}',       [AdminController::class, 'rejeterCoursier']);
});

    // Commandes

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

    // Messages
    Route::get   ('/commandes/{id}/messages',          [MessageController::class, 'index']);
    Route::post  ('/commandes/{id}/messages',          [MessageController::class, 'store']);
    Route::delete('/commandes/{commandeId}/messages/{messageId}', [MessageController::class, 'destroy']);
    Route::put   ('/commandes/{commandeId}/messages/{messageId}',      [MessageController::class, 'update']);
    // Notifications

    Route::post  ('/notifications/tous-lus',  [NotificationController::class, 'marquerTousLus']);
    Route::get   ('/notifications',           [NotificationController::class, 'index']);
    Route::post  ('/notifications/{id}/lu',   [NotificationController::class, 'marquerLu']);
    Route::delete('/notifications/{id}',      [NotificationController::class, 'destroy']);
});