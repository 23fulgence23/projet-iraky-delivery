<?php

namespace App\Http\Controllers;

use App\Models\SupportMessage;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;
use Tymon\JWTAuth\Facades\JWTAuth;

class SupportController extends Controller
{
    // ── Vérification admin (même principe que AdminController) ──
    private function checkAdmin()
    {
        $user = JWTAuth::user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Accès refusé');
        }
        return $user;
    }

    // ═══════════════════════════════════════════════
    //  BASE DE CONNAISSANCE — extraite des pages officielles
    //  (Accueil, À propos, Nos Services, Démarche, Contact)
    // ═══════════════════════════════════════════════
    private function baseConnaissance(string $prenom): string
    {
        return <<<TXT
Tu es l'assistant virtuel officiel de IRAKY Delivery, une plateforme de coursiers à Toliara, Madagascar.
Tu réponds UNIQUEMENT en français, de façon chaleureuse, concise (2 à 4 phrases maximum) et professionnelle.
Tu t'adresses au client par son prénom : {$prenom}.
Tu comprends les fautes d'orthographe, les abréviations et les formulations informelles ou incomplètes —
réponds toujours en te basant sur le sens réel de la question, même mal écrite ou mal orthographiée.

INFORMATIONS OFFICIELLES SUR IRAKY DELIVERY (ta seule source de vérité, ne rien inventer en dehors) :

— À PROPOS —
IRAKY Delivery est une plateforme numérique qui met en relation les habitants de Toliara avec des
coursiers locaux de confiance. Avantages : emploi local pour les jeunes coursiers, gain de temps
(plus besoin de faire la queue), prix abordable, service fiable avec coursiers vérifiés.

— NOS SERVICES —
- Facture JIRAMA : payer sa facture sans se déplacer
- Légalisation CIN / documents administratifs
- Banque / Trésor : éviter les files d'attente
- Achats : courses au SCORE, BazarBe, SCAMA et partout à Toliara
- Mentor universitaire : aide les étudiants à trouver un mentor dans leur domaine
- Livraison de colis et documents partout à Toliara

— TARIFS —
Tarif de base annoncé : 5 000 Ar par course.
Dans l'application, le tarif varie selon le moyen de transport du coursier :
Piéton 5 000 Ar, Vélo 6 000 Ar, Moto 8 000 Ar, Voiture 12 000 Ar.

— COMMENT ÇA MARCHE (CLIENT) —
1. S'inscrire gratuitement
2. Se connecter à son espace personnel
3. Remplir une demande (service, adresse, description)
4. Un coursier disponible accepte la demande
5. Suivre la mission en temps réel dans l'onglet « Suivi en temps réel »
6. Recevoir une notification une fois la mission terminée, et noter le coursier

— COMMENT ÇA MARCHE (COURSIER) —
1. Inscription sur la plateforme
2. Droit d'entrée unique : 10 000 Ar
3. Abonnement mensuel : 10 000 Ar/mois (obligatoire, sinon le compte est désactivé automatiquement)
4. Consulter les offres de commandes disponibles
5. Accepter librement les missions souhaitées
6. Renouveler l'abonnement chaque mois

— FONCTIONNALITÉS DE L'ESPACE CLIENT —
- « Mes commandes » : historique, possibilité de retirer une commande de sa liste
- « Suivi en temps réel » : commandes actives, discussion avec le coursier, marquer comme terminé
- « Mes messages » : conversations avec les coursiers, suppression possible et définitive
- « Profil » : informations personnelles et statistiques
- « Aide & Support » : appel, email, ce chat, et un guide complet

— CONTACT —
Téléphone : +261 38 21 266 83
Email : irakydelivery@gmail.com
Adresse : Enceinte Score BazarBe, Toliara

RÈGLES IMPORTANTES :
- Si la question ne concerne pas IRAKY Delivery, réponds poliment que tu es spécialisé dans l'aide
  sur IRAKY Delivery et propose de reformuler.
- Ne jamais inventer une information absente de ce texte.
- Si tu ne sais vraiment pas répondre, invite {$prenom} à contacter l'équipe au +261 38 21 266 83
  ou par email à irakydelivery@gmail.com.
TXT;
    }

    // ═══════════════════════════════════════════════
    //  RÉPONSE INTELLIGENTE — appel à l'API Groq (GRATUITE, sans carte bancaire)
    // ═══════════════════════════════════════════════
    // Groq héberge des modèles open-source (Llama) sur du matériel ultra
    // rapide, avec un vrai tier gratuit stable : ~14 400 requêtes/jour,
    // largement suffisant pour un chat support comme celui-ci.
    // Comprend naturellement les fautes d'orthographe, les synonymes et
    // les reformulations. Renvoie null si la clé API n'est pas configurée
    // ou si l'appel échoue — dans ce cas store() bascule automatiquement
    // sur le système de mots-clés local (genererReponseAuto) puis, en
    // dernier recours, sur un message générique.
    private function genererReponseIA(string $texte, string $prenom): ?string
    {
        $apiKey = config('services.groq.key');
        if (!$apiKey) {
            Log::error('Assistant IA support (Groq) : clé absente de config(\'services.groq.key\') — vérifie config/services.php et fais un php artisan config:clear');
            return null; // Clé non configurée → on laisse le fallback local répondre
        }

        try {
            $response = Http::withHeaders([
                'Content-Type'  => 'application/json',
                'Authorization' => 'Bearer ' . $apiKey,
            ])->timeout(15)->post(
                'https://api.groq.com/openai/v1/chat/completions',
                [
                    'model'      => 'llama-3.3-70b-versatile', // ✅ meilleure qualité, gratuit
                    'max_tokens' => 400,
                    'messages'   => [
                        ['role' => 'system', 'content' => $this->baseConnaissance($prenom)],
                        ['role' => 'user',   'content' => $texte],
                    ],
                ]
            );

            if (!$response->successful()) {
                Log::error('Assistant IA support (Groq) : réponse API non réussie — status ' . $response->status() . ' — ' . $response->body());
                return null;
            }

            $data = $response->json();
            return $data['choices'][0]['message']['content'] ?? null;
        } catch (\Throwable $e) {
            Log::error('Assistant IA support (Groq) : exception — ' . $e->getMessage());
            return null;
        }
    }

    // ═══════════════════════════════════════════════
    //  ASSISTANT AUTOMATIQUE — filet de secours local (mots-clés)
    // ═══════════════════════════════════════════════
    // Utilisé uniquement si genererReponseIA() renvoie null
    // (clé API absente, quota dépassé, panne réseau...).
    // Analyse le texte du client et renvoie une réponse instantanée
    // si le message correspond à une salutation ou à une question
    // courante sur l'application. Renvoie null si aucune correspondance.
    private function genererReponseAuto(string $texte, string $prenom): ?string
    {
        $t = mb_strtolower(trim($texte));
        // Retire les accents pour matcher plus largement (coûte -> cout)
        $t = strtr($t, [
            'à'=>'a','â'=>'a','ä'=>'a','é'=>'e','è'=>'e','ê'=>'e','ë'=>'e',
            'î'=>'i','ï'=>'i','ô'=>'o','ö'=>'o','ù'=>'u','û'=>'u','ü'=>'u','ç'=>'c',
        ]);

        $contient = function (array $mots) use ($t) {
            foreach ($mots as $mot) {
                if (str_contains($t, $mot)) return true;
            }
            return false;
        };

        // 1. Salutations
        if ($contient(['bonjour','bonsoir','salut','coucou','hello','hi ','bonne journee'])) {
            return "Bonjour {$prenom} 👋 ! Je suis l'assistant IRAKY Delivery. Comment puis-je vous aider aujourd'hui ? Vous pouvez me parler de vos commandes, des tarifs, du suivi ou de tout autre sujet.";
        }

        // 2. Remerciements
        if ($contient(['merci','thanks','thank you'])) {
            return "Avec plaisir {$prenom} 😊 ! N'hésitez pas si vous avez d'autres questions.";
        }

        // 3. Au revoir
        if ($contient(['au revoir','a bientot','bye','a plus'])) {
            return "À bientôt {$prenom} 👋 ! L'équipe IRAKY Delivery reste disponible si besoin.";
        }

        // 4. Comment fonctionne l'application
        if ($contient(['comment ca marche','comment ca fonctionne','comment fonctionne','comment ca marche irak','fonctionnement'])) {
            return "IRAKY Delivery fonctionne simplement : vous créez une commande (Achat, Facture JIRAMA, Banque, Légalisation, Éducation, Livraison, Bazary...), un coursier disponible la prend en charge, puis vous suivez son avancement en temps réel jusqu'à la livraison. 🚴";
        }

        // 5. Tarifs / prix
        if ($contient(['tarif','prix','combien coute','combien ca coute','cout'])) {
            return "Nos tarifs dépendent du moyen de transport choisi : Piéton 5 000 Ar, Vélo 6 000 Ar, Moto 8 000 Ar, Voiture 12 000 Ar. 💰";
        }

        // 6. Annulation de commande
        if ($contient(['annuler','annulation','supprimer ma commande'])) {
            return "Vous pouvez annuler une commande tant qu'elle est en statut « En attente » ou « Refusée », directement depuis l'onglet « Mes commandes ». ✅";
        }

        // 7. Suivi de commande
        if ($contient(['ou est mon coursier','suivi','suivre ma commande','ou en est ma commande','statut de ma commande'])) {
            return "Vous pouvez suivre votre commande en temps réel depuis l'onglet « Suivi en temps réel » 📍 : vous y voyez l'avancement et pouvez discuter directement avec le coursier.";
        }

        // 8. Noter un coursier
        if ($contient(['noter','note','evaluer','evaluation','etoile'])) {
            return "Une fois votre commande marquée comme « Terminée », une note est automatiquement attribuée au coursier. ⭐";
        }

        // 9. Messagerie
        if ($contient(['message','discuter avec','contacter le coursier','chat avec'])) {
            return "Dès qu'un coursier prend votre commande, une conversation s'ouvre automatiquement dans l'onglet « Mes messages » 💬. Vous pouvez y échanger tous les détails utiles.";
        }

        // 10. Profil / compte
        if ($contient(['profil','mon compte','modifier mes informations','changer mon numero','changer mon email'])) {
            return "Vous pouvez consulter et gérer vos informations personnelles depuis l'onglet « Profil » 👤.";
        }

        // 11. Contact humain / numéro
        if ($contient(['numero','telephone','appeler','joindre quelqu\'un','parler a un humain','agent'])) {
            return "Vous pouvez nous appeler directement au +261 38 21 266 83 📞, ou continuer ici : un membre de notre équipe prendra le relais sous peu.";
        }

        // Aucune correspondance : pas de réponse automatique,
        // un membre de l'équipe répondra manuellement.
        return null;
    }

    // ═══════════════════════════════════════════════
    //  CÔTÉ CLIENT
    // ═══════════════════════════════════════════════

    // GET /api/support/messages — historique du client connecté
    public function index()
    {
        $user = JWTAuth::user();

        $messages = SupportMessage::where('client_id', $user->id)
            ->orderBy('created_at', 'asc')
            ->get();

        // ✅ Marque comme lus côté client les messages envoyés par l'admin
        SupportMessage::where('client_id', $user->id)
            ->where('sender_role', 'admin')
            ->where('lu', false)
            ->update(['lu' => true]);

        return response()->json($messages);
    }

    // POST /api/support/messages — le client envoie un message au support
    public function store(Request $request)
    {
        $request->validate([
            'texte' => 'required|string|max:2000',
        ], [
            'texte.required' => 'Le message ne peut pas être vide.',
            'texte.max'      => 'Le message est trop long (2000 caractères max).',
        ]);

        $user = JWTAuth::user();

        $message = SupportMessage::create([
            'client_id'   => $user->id,
            'sender_role' => 'client',
            'sender_id'   => $user->id,
            'texte'       => $request->texte,
            'lu'          => false,
        ]);

        // ✅ Notifie tous les admins d'un nouveau message support
        $admins = \App\Models\User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id'       => $admin->id,
                'texte'         => "💬 Nouveau message support de {$user->prenom} {$user->nom}",
                'type'          => 'info',
                'commande_id'   => null,
                'user_id_cible' => $user->id,
            ]);
        }

        // ✅ Réponse automatique instantanée, TOUJOURS générée :
        //    1) l'IA (Claude) répond intelligemment à quasi toute question
        //    2) si l'IA est indisponible, le système de mots-clés local prend le relais
        //    3) en tout dernier recours, un message générique garanti est envoyé
        //    sender_id = null distingue une réponse "bot" d'une vraie
        //    réponse tapée par un admin.
        $texteAuto = $this->genererReponseIA($request->texte, $user->prenom)
            ?? $this->genererReponseAuto($request->texte, $user->prenom)
            ?? "Merci pour votre message {$user->prenom} ! Un membre de notre équipe va vous répondre très vite. Vous pouvez aussi nous appeler au +261 38 21 266 83. 😊";

        $bot = SupportMessage::create([
            'client_id'   => $user->id,
            'sender_role' => 'admin',
            'sender_id'   => null,
            'texte'       => $texteAuto,
            'lu'          => true,
        ]);

        return response()->json([
            'message' => $message,
            'bot'     => $bot,
        ], 201);
    }

    // ═══════════════════════════════════════════════
    //  CÔTÉ ADMIN
    // ═══════════════════════════════════════════════

    // GET /api/admin/support/conversations — liste des conversations (1 par client)
    public function adminConversations()
    {
        $this->checkAdmin();

        $dernierMessage = SupportMessage::selectRaw('MAX(id) as id')
            ->groupBy('client_id');

        $conversations = SupportMessage::whereIn('id', $dernierMessage)
            ->with('client:id,nom,prenom,email,telephone')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($m) {
                return [
                    'client_id'      => $m->client_id,
                    'client'         => $m->client,
                    'dernier_message'=> $m->texte,
                    'sender_role'    => $m->sender_role,
                    'date'           => $m->created_at,
                    'non_lus'        => SupportMessage::where('client_id', $m->client_id)
                                            ->where('sender_role', 'client')
                                            ->where('lu', false)
                                            ->count(),
                ];
            });

        return response()->json($conversations);
    }

    // GET /api/admin/support/conversations/{clientId} — messages d'un client
    public function adminMessages($clientId)
    {
        $this->checkAdmin();

        $messages = SupportMessage::where('client_id', $clientId)
            ->orderBy('created_at', 'asc')
            ->get();

        // ✅ Marque comme lus côté admin les messages envoyés par le client
        SupportMessage::where('client_id', $clientId)
            ->where('sender_role', 'client')
            ->where('lu', false)
            ->update(['lu' => true]);

        return response()->json($messages);
    }

    // POST /api/admin/support/conversations/{clientId}/repondre — l'admin répond
    public function adminReply(Request $request, $clientId)
    {
        $admin = $this->checkAdmin();

        $request->validate([
            'texte' => 'required|string|max:2000',
        ]);

        $message = SupportMessage::create([
            'client_id'   => $clientId,
            'sender_role' => 'admin',
            'sender_id'   => $admin->id,
            'texte'       => $request->texte,
            'lu'          => false,
        ]);

        // ✅ Notifie le client qu'il a reçu une réponse du support
        Notification::create([
            'user_id'       => $clientId,
            'texte'         => "💬 Le support IRAKY Delivery vous a répondu",
            'type'          => 'info',
            'commande_id'   => null,
            'user_id_cible' => null,
        ]);

        return response()->json($message, 201);
    }

    // GET /api/admin/support/export-pdf — export de TOUTES les conversations
    // (ou d'une seule si ?client_id=X est fourni), pour l'admin, à des fins
    // de sécurité/audit.
    public function exporterConversationsPdf(Request $request)
    {
        $this->checkAdmin();

        $clientId = $request->query('client_id');

        $requete = SupportMessage::with('client:id,nom,prenom,email,telephone')
            ->orderBy('client_id')
            ->orderBy('created_at');

        if ($clientId) {
            $requete->where('client_id', $clientId);
        }

        $conversations = $requete->get()->groupBy('client_id');

        $nomFichier = $clientId
            ? 'conversation-support-client-' . $clientId . '-' . now()->format('Y-m-d_His') . '.pdf'
            : 'conversations-support-iraky-' . now()->format('Y-m-d_His') . '.pdf';

        $pdf = Pdf::loadView('pdf.support_conversations', [
            'conversations' => $conversations,
            'genereLe'      => now()->format('d/m/Y à H:i'),
        ])->setPaper('a4', 'portrait');

        return $pdf->download($nomFichier);
    }
}