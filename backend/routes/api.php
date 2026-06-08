<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;

// ✅ Routes publiques
Route::post('/register',        [AuthController::class, 'register']);
Route::post('/login',           [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

// ✅ Routes protégées
Route::middleware('auth:api')->group(function () {

    // ── Auth ──
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // ── Users (admin) ──
    Route::get('/users', [UserController::class, 'index']);

    // ── Commandes ──
    Route::post('/commandes',                  [CommandeController::class, 'publier']);
    Route::get ('/commandes/disponibles',      [CommandeController::class, 'disponibles']);
    Route::get ('/commandes/mes-commandes',    [CommandeController::class, 'mesCommandes']);
    Route::get ('/commandes/mes-missions',     [CommandeController::class, 'mesMissions']);
    Route::post('/commandes/{id}/prendre',     [CommandeController::class, 'prendreMission']);
    Route::post('/commandes/{id}/accepter',    [CommandeController::class, 'accepter']);
    Route::post('/commandes/{id}/terminer',    [CommandeController::class, 'terminer']);

    // ── Messages ──
    Route::post('/commandes/{id}/messages',   [MessageController::class, 'envoyer']);
    Route::get ('/commandes/{id}/messages',   [MessageController::class, 'lire']);

    // ── Notifications ──
    Route::get ('/notifications',             [NotificationController::class, 'mesNotifications']);
    Route::post('/notifications/marquer-lues',[NotificationController::class, 'marquerLues']);
    Route::get ('/notifications/non-lues',    [NotificationController::class, 'nonLues']);
});