<?php
namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Commande;
use App\Models\Notification;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class MessageController extends Controller
{
    public function index($commandeId)
    {
        $user     = JWTAuth::user();
        $commande = Commande::findOrFail($commandeId);

        $estClient   = (int)$commande->client_id === (int)$user->id;
        $estCoursier = $commande->coursier_id
                    && (int)$commande->coursier_id === (int)$user->id;

        if (!$estClient && !$estCoursier) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $messages = Message::where('commande_id', $commandeId)
            ->orderBy('created_at')
            ->get()
            ->filter(fn($m) =>
                !((int)$m->sender_id === (int)$user->id && $m->supprime_sender) &&
                !((int)$m->sender_id !== (int)$user->id && $m->supprime_receiver)
            )
            ->map(fn($m) => [
                'id'          => $m->id,
                'texte'       => $m->texte,
                'sender_id'   => (int)$m->sender_id,
                'sender_role' => $m->sender_role,
                'lu'          => (bool)$m->lu,
                'modifie'     => (bool)$m->modifie,
                'created_at'  => $m->created_at,
                'time'        => $m->created_at->format('H:i'),
            ])
            ->values();

        // ✅ Marquer comme lus sans charger la relation sender (plus rapide)
        Message::where('commande_id', $commandeId)
            ->where('sender_id', '!=', $user->id)
            ->where('lu', false)
            ->update(['lu' => true]);

        return response()->json($messages);
    }

    public function store(Request $request, $commandeId)
    {
        $user     = JWTAuth::user();
        $commande = Commande::findOrFail($commandeId);

        $estClient   = (int)$commande->client_id === (int)$user->id;
        $estCoursier = $commande->coursier_id
                    && (int)$commande->coursier_id === (int)$user->id;

        if (!$estClient && !$estCoursier) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $request->validate(['texte' => 'required|string|max:1000']);

        // ✅ Pas de with('sender') ici — plus rapide
        $message = Message::create([
            'commande_id' => (int)$commandeId,
            'sender_id'   => $user->id,
            'sender_role' => $user->role,
            'texte'       => $request->texte,
            'lu'          => false,
            'modifie'     => false,
        ]);

        // Notif destinataire
        $destinataireId = $estClient
            ? $commande->coursier_id
            : $commande->client_id;

        if ($destinataireId) {
            Notification::create([
                'user_id'     => $destinataireId,
                'texte'       => "{$user->prenom} : {$request->texte}",
                'type'        => 'message',
                'commande_id' => (int)$commandeId,
            ]);
        }

        // ✅ Retourne directement sans reload
        return response()->json([
            'message' => [
                'id'          => $message->id,
                'texte'       => $message->texte,
                'sender_id'   => (int)$message->sender_id,
                'sender_role' => $message->sender_role,
                'modifie'     => false,
                'lu'          => false,
                'time'        => $message->created_at->format('H:i'),
                'created_at'  => $message->created_at,
            ]
        ], 201);
    }

    public function update(Request $request, $commandeId, $messageId)
    {
        $user    = JWTAuth::user();
        $message = Message::findOrFail($messageId);

        if ((int)$message->sender_id !== (int)$user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate(['texte' => 'required|string|max:1000']);
        $message->update(['texte' => $request->texte, 'modifie' => true]);

        return response()->json(['message' => 'Modifié', 'data' => [
            'id'      => $message->id,
            'texte'   => $message->texte,
            'modifie' => true,
        ]]);
    }

    public function destroy($commandeId, $messageId)
    {
        $user    = JWTAuth::user();
        $message = Message::findOrFail($messageId);

        if ((int)$message->sender_id === (int)$user->id) {
            $message->update(['supprime_sender' => true]);
        } else {
            $message->update(['supprime_receiver' => true]);
        }

        return response()->json(['message' => 'Supprimé']);
    }
}