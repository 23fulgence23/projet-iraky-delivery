<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

// Temporaire : mesure la latence entre le serveur et la base. A supprimer ensuite.
class DiagController extends Controller
{
    public function latence()
    {
        $u = JWTAuth::user();
        if (!$u || $u->role !== 'admin') {
            abort(403, 'Accès refusé.');
        }
        $ms = fn ($t) => round((microtime(true) - $t) * 1000);

        $t = microtime(true);
        DB::select('select 1');
        $premiere = $ms($t);

        $simples = [];
        for ($i = 0; $i < 5; $i++) {
            $t = microtime(true);
            DB::select('select 1');
            $simples[] = $ms($t);
        }
        $t = microtime(true);
        DB::table('users')->count();
        $comptage = $ms($t);

        return response()->json([
            'depuis_debut_laravel_ms' => defined('LARAVEL_START') ? round((microtime(true) - LARAVEL_START) * 1000) : null,
            'premiere_requete_ms'     => $premiere,
            'requetes_simples_ms'     => $simples,
            'comptage_users_ms'       => $comptage,
            'opcache'                 => function_exists('opcache_get_status') ? (bool) (@opcache_get_status(false)['opcache_enabled'] ?? false) : false,
            'php'                     => PHP_VERSION,
        ]);
    }
}
