<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Commande;
use App\Models\NotificationIraky;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class MessageController extends Controller
{
    // ✅ Envoyer un message
   public function envoyer(Request $request, $commande_id)
{
    $request->validate([
        'texte' => 'required|string|max:1000',
    ]);

    $sender   = JWTAuth::user();
    $commande = Commande::findOrFail($commande_id);

    // ✅ Autoriser le coursier même si pas encore assigné (statut negociable)
    $estClient   = $sender->id === $commande->client_id;
    $estCoursier = $sender->id === $commande->coursier_id;
    $estCoursierId = $sender->role === 'coursier';

    if (!$estClient && !$estCoursier && !$estCoursierId) {
        return response()->json(['message' => 'Non autorisé'], 403);
    }

    $message = Message::create([
        'commande_id' => $commande_id,
        'sender_id'   => $sender->id,
        'texte'       => $request->texte,
    ]);

    // Notifier le destinataire
    $destinataire_id = $estClient
        ? $commande->coursier_id
        : $commande->client_id;

    if ($destinataire_id) {
        NotificationIraky::create([
            'user_id'     => $destinataire_id,
            'texte'       => "{$sender->prenom} : {$request->texte}",
            'type'        => 'message',
            'commande_id' => $commande_id,
        ]);
    }

    return response()->json([
        'message' => $message->load('sender:id,nom,prenom,role'),
    ], 201);
}

    // ✅ Lire les messages d'une commande
    public function lire($commande_id)
    {
        $user     = JWTAuth::user();
        $commande = Commande::findOrFail($commande_id);

        if ($user->id !== $commande->client_id && $user->id !== $commande->coursier_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $messages = Message::where('commande_id', $commande_id)
            ->with('sender:id,nom,prenom,role')
            ->orderBy('created_at')
            ->get();

        // Marquer comme lus
        Message::where('commande_id', $commande_id)
               ->where('sender_id', '!=', $user->id)
               ->update(['lu' => true]);

        return response()->json($messages);
    }
}