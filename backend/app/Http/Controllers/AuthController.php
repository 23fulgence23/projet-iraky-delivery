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
        $data = [
            'nom'      => $request->nom,
            'prenom'   => $request->prenom,
            'email'    => $request->email,
            'telephone'=> $request->telephone,
            'adresse'  => $request->adresse,
            'password' => Hash::make($request->password),
            'role'     => $request->role ?? 'client',
            'statut'   => 'actif', // ✅ tous actifs sans paiement
            'latitude' => $request->latitude,
            'longitude'=> $request->longitude,
            'localisation' => $request->localisation,
        ];

        // Champs spécifiques coursier
        if ($request->role === 'coursier') {
            $data['cin'] = $request->cin;

            // Photo recto
            if ($request->hasFile('photo_recto')) {
                $data['photo_identite'] = $request->file('photo_recto')
                    ->store('identites', 'public');
            }

            // Photo verso
            if ($request->hasFile('photo_verso')) {
                $data['photo_verso'] = $request->file('photo_verso')
                    ->store('identites', 'public');
            }
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
        $credentials = [
            'email'    => $request->email,
            'password' => $request->password,
        ];

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect',
            ], 401);
        }

        $user = JWTAuth::user();

        // ✅ Paiement désactivé — on ignore statut inactif pour l'instant
        // if ($user->statut === 'inactif') { ... }

        return response()->json([
            'token' => $token,
            'user'  => $user,
        ]);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function forgotPassword(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Email non trouvé'], 404);
        }
        return response()->json([
            'message' => 'Un email de réinitialisation a été envoyé',
        ]);
    }

    public function me()
    {
        return response()->json(JWTAuth::user());
    }
}