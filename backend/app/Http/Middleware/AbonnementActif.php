<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class AbonnementActif
{
    public function handle(Request $request, Closure $next)
    {
        User::suspendreAbonnementsExpires();

        $user = JWTAuth::user();
        if ($user && $user->role === 'coursier') {
            $user->refresh();
            if ($user->statut === 'suspendu') {
                return response()->json([
                    'message' => "Vous n'avez pas encore payé votre abonnement.",
                    'abonnement_impaye' => true,
                ], 403);
            }
        }

        return $next($request);
    }
}
