<?php

namespace App\Http\Controllers;

use App\Models\NotificationIraky;
use Tymon\JWTAuth\Facades\JWTAuth;

class NotificationController extends Controller
{
    // ✅ Mes notifications
    public function mesNotifications()
    {
        $user = JWTAuth::user();

        $notifs = NotificationIraky::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->take(30)
            ->get()
            ->map(fn($n) => [
                'id'          => $n->id,
                'texte'       => $n->texte,
                'type'        => $n->type,
                'lu'          => (bool) $n->lu,
                'commande_id' => $n->commande_id,
                'time'        => $n->created_at->diffForHumans(),
            ]);

        return response()->json($notifs);
    }

    // ✅ Marquer toutes comme lues
    public function marquerLues()
    {
        $user = JWTAuth::user();

        NotificationIraky::where('user_id', $user->id)
                         ->where('lu', false)
                         ->update(['lu' => true]);

        return response()->json(['message' => 'Notifications marquées comme lues']);
    }

    // ✅ Nombre non lues
    public function nonLues()
    {
        $user  = JWTAuth::user();
        $count = NotificationIraky::where('user_id', $user->id)
                                  ->where('lu', false)
                                  ->count();

        return response()->json(['count' => $count]);
    }
}