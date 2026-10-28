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
            'id'            => $n->id,
            'texte'         => $n->texte,
            'type'          => $n->type,
            'lu'            => (bool) $n->lu,
            'commande_id'   => $n->commande_id,
            'user_id_cible' => $n->user_id_cible,
            'time'          => $n->created_at->diffForHumans(),
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

    public function supprimerSelection(\Illuminate\Http\Request $request)
    {
        $user = JWTAuth::user();
        $data = $request->validate([
            'ids'   => 'required|array|min:1|max:500',
            'ids.*' => 'integer',
        ]);
        $n = Notification::where('user_id', $user->id)->whereIn('id', $data['ids'])->delete();
        return response()->json(['message' => 'Notifications supprimées', 'supprimees' => $n]);
    }

    public function supprimerTout()
    {
        $user = JWTAuth::user();
        $n = Notification::where('user_id', $user->id)->delete();
        return response()->json(['message' => 'Notifications supprimées', 'supprimees' => $n]);
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