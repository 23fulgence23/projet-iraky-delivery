<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nom'         => 'required|string|max:255',
            'prenom'      => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email',
            'telephone'   => 'required|string|max:20',
            'adresse'     => 'nullable|string|max:255',
            'password'    => 'required|string|min:6|confirmed',
            'role'        => 'nullable|in:client,coursier,admin', // ✅ admin ajouté
            'cin'         => 'nullable|string|max:20',
            'photo_recto' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:10240',
            'photo_verso' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:10240',
        ]);

        $data = [
            'nom'          => $request->nom,
            'prenom'       => $request->prenom,
            'email'        => $request->email,
            'telephone'    => $request->telephone,
            'adresse'      => $request->adresse,
            'password'     => Hash::make($request->password),
            'role'         => $request->role ?? 'client',
            'statut'       => 'actif',
            'latitude'     => $request->latitude,
            'longitude'    => $request->longitude,
            'localisation' => $request->localisation,
            'cin'          => $request->cin,
        ];

        if ($request->hasFile('photo_recto')) {
            $data['photo_recto'] = $request->file('photo_recto')
                ->store('identites', 'public');
        }

        if ($request->hasFile('photo_verso')) {
            $data['photo_verso'] = $request->file('photo_verso')
                ->store('identites', 'public');
        }

        $user  = User::create($data);
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Inscription réussie',
            'token'   => $token,
            'user'    => $user,
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

        // ✅ Redirection selon le rôle retournée dans la réponse
        return response()->json([
            'token'     => $token,
            'user'      => $user,
            'role'      => $user->role,
            'redirect'  => match($user->role) {
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
}