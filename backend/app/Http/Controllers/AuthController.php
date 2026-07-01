<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
public function register(Request $request)
{
    // ✅ Si un compte rejeté existe avec cet email, le supprimer avant validation
    $ancienCompte = User::where('email', $request->email)
        ->where('statut', 'rejete')
        ->first();
    if ($ancienCompte) {
        $ancienCompte->delete();
    }

    $request->validate([
        'nom'         => 'required|string|max:255',
        'prenom'      => 'required|string|max:255',
        'email'       => 'required|email|unique:users,email',
        'telephone'   => 'required|string|max:20',
        'adresse'     => 'required|string|max:255',
        'password'    => 'required|string|min:6|confirmed',
        'role'        => 'nullable|in:client,coursier,admin',
        'cin'         => 'required_if:role,coursier|nullable|string|max:20',
        'photo_recto' => 'required_if:role,coursier|nullable|file|mimes:jpg,jpeg,png,webp|max:10240',
        'photo_verso' => 'required_if:role,coursier|nullable|file|mimes:jpg,jpeg,png,webp|max:10240',
        'mvola_transaction' => 'required_if:role,coursier|nullable|string|max:100',
    ], [
        'nom.required'              => 'Le nom est obligatoire.',
        'prenom.required'           => 'Le prénom est obligatoire.',
        'email.required'            => 'L\'email est obligatoire.',
        'email.unique'              => 'Cet email est déjà utilisé.',
        'telephone.required'        => 'Le téléphone est obligatoire.',
        'adresse.required'          => 'L\'adresse est obligatoire.',
        'password.required'         => 'Le mot de passe est obligatoire.',
        'password.min'              => 'Le mot de passe doit contenir au moins 6 caractères.',
        'password.confirmed'        => 'Les mots de passe ne correspondent pas.',
        'cin.required_if'           => 'Le numéro CIN est obligatoire pour les coursiers.',
        'photo_recto.required_if'   => 'La photo recto du CIN est obligatoire.',
        'photo_recto.max'           => 'La photo recto doit être inférieure ou égale à 10 Mo.',
        'photo_recto.mimes'         => 'La photo recto doit être au format jpg, jpeg, png ou webp.',
        'photo_verso.required_if'   => 'La photo verso du CIN est obligatoire.',
        'photo_verso.max'           => 'La photo verso doit être inférieure ou égale à 10 Mo.',
        'photo_verso.mimes'         => 'La photo verso doit être au format jpg, jpeg, png ou webp.',
        'mvola_transaction.required_if' => 'La référence MVola est obligatoire pour les coursiers.',
    ]);

    $statutInitial = ($request->role === 'coursier') ? 'inactif' : 'actif';

    $data = [
        'nom'               => $request->nom,
        'prenom'            => $request->prenom,
        'email'             => $request->email,
        'telephone'         => $request->telephone,
        'adresse'           => $request->adresse,
        'password'          => Hash::make($request->password),
        'role'              => $request->role ?? 'client',
        'statut'            => $statutInitial,
        'cin'               => $request->cin,
        'mvola_transaction' => $request->mvola_transaction ?? null,
        // ✅ latitude/longitude optionnels (plus obligatoires)
        'latitude'          => $request->latitude ?? null,
        'longitude'         => $request->longitude ?? null,
        'localisation'      => $request->localisation ?? null,
    ];

    if ($request->hasFile('photo_recto')) {
        $data['photo_recto'] = $request->file('photo_recto')->store('identites', 'public');
    }
    if ($request->hasFile('photo_verso')) {
        $data['photo_verso'] = $request->file('photo_verso')->store('identites', 'public');
    }

    $user = User::create($data);

    // ✅ Notifier l'admin
    $admin = User::where('role', 'admin')->first();
    if ($admin) {
        Notification::create([
            'user_id'       => $admin->id,
            'texte'         => $user->role === 'coursier'
                ? "🆕 Nouveau coursier inscrit : {$user->prenom} {$user->nom} — En attente de vérification"
                : "🆕 Nouveau client inscrit : {$user->prenom} {$user->nom}",
            'type'          => $user->role === 'coursier' ? 'warning' : 'info',
            'commande_id'   => null,
            'user_id_cible' => $user->id,
        ]);
    }

    $token = JWTAuth::fromUser($user);

    $message = $user->role === 'coursier'
        ? 'Inscription réussie ! Votre compte est en attente de vérification par l\'administrateur.'
        : 'Inscription réussie !';

    return response()->json([
        'message' => $message,
        'token'   => $token,
        'user'    => $user,
        'pending' => $user->role === 'coursier',
    ], 201);
}

public function login(Request $request)
{
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required|string',
    ]);

    $credentials = $request->only('email', 'password');

    if (!$token = JWTAuth::attempt($credentials)) {
        return response()->json([
            'message' => 'Email ou mot de passe incorrect',
        ], 401);
    }

    $user = JWTAuth::user();

    // ✅ Bloquer la connexion si coursier inactif (en attente de vérification)
    if ($user->role === 'coursier' && $user->statut === 'inactif') {
        JWTAuth::invalidate($token); // invalide le token généré
        return response()->json([
            'message' => 'Votre compte est en attente de vérification par l\'administrateur. Veuillez réessayer plus tard.',
            'pending' => true,
        ], 403);
    }

    return response()->json([
        'token'    => $token,
        'user'     => $user,
        'role'     => $user->role,
        'redirect' => match($user->role) {
            'admin'    => '/admin/dashboard',
            'coursier' => '/coursier/dashboard',
            default    => '/client/dashboard',
        },
    ]);
}

    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Déconnexion réussie']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la déconnexion'], 500);
        }
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Email non trouvé'], 404);
        }

        // TODO: implémenter l'envoi d'email de réinitialisation
        return response()->json([
            'message' => 'Un email de réinitialisation a été envoyé',
        ]);
    }

    public function me()
    {
        try {
            $user = JWTAuth::user();

            if (!$user) {
                return response()->json(['message' => 'Utilisateur non trouvé'], 404);
            }

            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Token invalide'], 401);
        }
    }
    // ── Vérifier si un coursier a été validé (polling depuis l'écran d'attente) ──
 public function verifierStatutCoursier($id)
{
    $user = User::find($id);

    if (!$user || $user->role !== 'coursier') {
        return response()->json(['statut' => 'introuvable'], 404);
    }

    // ✅ Si rejeté, récupérer aussi le message de rejet
    if ($user->statut === 'rejete') {
        $notifRejet = \App\Models\Notification::where('user_id', $user->id)
            ->where('type', 'warning')
            ->orderByDesc('created_at')
            ->first();

        return response()->json([
            'statut'  => 'rejete',
            'message' => $notifRejet ? $notifRejet->texte : 'Votre dossier a été rejeté.',
        ]);
    }

    return response()->json([
        'statut' => $user->statut, // 'actif' ou 'inactif'
    ]);
}
        private function distanceKm($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat/2) * sin($dLat/2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon/2) * sin($dLon/2);
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        return $earthRadius * $c;
    }
}