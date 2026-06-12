<?php
namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class NotificationController extends Controller
{
    public function index()
    {
        $user = JWTAuth::user();
        $notifs = Notification::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($n) => [
                'id'          => $n->id,
                'texte'       => $n->texte,
                'type'        => $n->type,
                'lu'          => $n->lu,
                'commande_id' => $n->commande_id,
                'time'        => $n->created_at->diffForHumans(),
                'created_at'  => $n->created_at,
            ]);
        return response()->json($notifs);
    }

    public function marquerLu($id)
    {
        $user  = JWTAuth::user();
        $notif = Notification::where('id', $id)
            ->where('user_id', $user->id)->firstOrFail();
        $notif->update(['lu' => true]);
        return response()->json(['message' => 'Lu']);
    }

    public function marquerTousLus()
    {
        $user = JWTAuth::user();
        Notification::where('user_id', $user->id)->update(['lu' => true]);
        return response()->json(['message' => 'Tout marqué comme lu']);
    }

    public function destroy($id)
    {
        $user  = JWTAuth::user();
        $notif = Notification::where('id', $id)
            ->where('user_id', $user->id)->firstOrFail();
        $notif->delete();
        return response()->json(['message' => 'Notification supprimée']);
    }
}