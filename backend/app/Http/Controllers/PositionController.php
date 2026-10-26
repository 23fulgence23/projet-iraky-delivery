<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\PositionUtilisateur;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;

class PositionController extends Controller
{
    const DELAI_EN_LIGNE = 120; // secondes sans position = hors ligne
    const DISTANCE_MIN_M = 25;  // deplacement minimal pour ajouter un point au trajet
    const PAUSE_MAX_MIN  = 5;   // au moins un point toutes les 5 minutes

    private function utilisateur(): User
    {
        $u = JWTAuth::user();
        if (!$u) {
            abort(401, 'Non authentifié.');
        }
        return $u;
    }

    private function admin(): User
    {
        $u = JWTAuth::user();
        if (!$u || $u->role !== 'admin') {
            abort(403, 'Accès refusé.');
        }
        return $u;
    }

    private function consentementDe(User $u): ?bool
    {
        if ($u->partage_position === null) {
            return null;
        }
        return filter_var($u->partage_position, FILTER_VALIDATE_BOOLEAN);
    }

    private function metres(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $r    = 6371000;
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a    = sin($dLat / 2) ** 2 + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) ** 2;
        return 2 * $r * asin(min(1, sqrt($a)));
    }

    // ── Etat du consentement de l'utilisateur connecte ──
    public function etat()
    {
        $u = $this->utilisateur();
        return response()->json([
            'consentement' => $this->consentementDe($u),
            'obligatoire'  => $u->role === 'coursier',
        ]);
    }

    // ── Accepter / refuser le partage ──
    public function consentement(Request $request)
    {
        $u = $this->utilisateur();
        if (!in_array($u->role, ['client', 'coursier'], true)) {
            return response()->json(['message' => 'Réservé aux clients et aux coursiers.'], 403);
        }

        $data = $request->validate(['accepte' => 'required|boolean']);
        $accepte = (bool) $data['accepte'];

        if ($u->role === 'coursier' && !$accepte) {
            return response()->json(['message' => 'La localisation est obligatoire pour les coursiers.'], 422);
        }

        $maj = ['partage_position' => $accepte];
        if (!$accepte) {
            $maj += ['position_lat' => null, 'position_lng' => null, 'position_precision' => null, 'position_at' => null];
        }
        User::where('id', $u->id)->update($maj);

        return response()->json(['ok' => true]);
    }

    // ── Enregistrer la position (utilisateur connecte, avec accord) ──
    public function enregistrer(Request $request)
    {
        $u = $this->utilisateur();
        if (!in_array($u->role, ['client', 'coursier'], true)) {
            return response()->json(['message' => 'Réservé aux clients et aux coursiers.'], 403);
        }
        if ($u->role === 'client' && $this->consentementDe($u) !== true) {
            return response()->json(['message' => 'Partage de position non autorisé.'], 403);
        }

        $data = $request->validate([
            'latitude'  => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'precision' => 'nullable|numeric|min:0',
        ]);

        $lat = round((float) $data['latitude'], 7);
        $lng = round((float) $data['longitude'], 7);
        $precision = isset($data['precision']) ? (int) round($data['precision']) : null;

        User::where('id', $u->id)->update([
            'partage_position'   => true,
            'position_lat'       => $lat,
            'position_lng'       => $lng,
            'position_precision' => $precision,
            'position_at'        => now(),
        ]);

        // Historique du trajet : uniquement pendant une mission acceptee
        if ($u->role === 'coursier') {
            $cmd = Commande::where('coursier_id', $u->id)->where('statut', 'accepte')->orderByDesc('id')->first();
            if ($cmd) {
                $dernier = PositionUtilisateur::where('user_id', $u->id)->where('commande_id', $cmd->id)->orderByDesc('id')->first();
                $ajouter = !$dernier
                    || $this->metres((float) $dernier->latitude, (float) $dernier->longitude, $lat, $lng) >= self::DISTANCE_MIN_M
                    || ($dernier->created_at && $dernier->created_at->lt(now()->subMinutes(self::PAUSE_MAX_MIN)));
                if ($ajouter) {
                    PositionUtilisateur::create([
                        'user_id'     => $u->id,
                        'commande_id' => $cmd->id,
                        'latitude'    => $lat,
                        'longitude'   => $lng,
                        'precision_m' => $precision,
                    ]);
                }
            }
        }

        // Nettoyage occasionnel : historique de plus de 30 jours
        if (random_int(1, 200) === 1) {
            PositionUtilisateur::where('created_at', '<', now()->subDays(30))->delete();
        }

        return response()->json(['ok' => true]);
    }

    // ── Admin : utilisateurs connectes qui partagent leur position ──
    public function adminListe()
    {
        $this->admin();

        $users = User::whereIn('role', ['client', 'coursier'])
            ->where('partage_position', true)
            ->whereNotNull('position_lat')
            ->whereNotNull('position_lng')
            ->where('position_at', '>=', now()->subSeconds(self::DELAI_EN_LIGNE))
            ->orderByDesc('position_at')
            ->get();

        $liste = $users->map(function ($u) {
            $mission = null;
            if ($u->role === 'coursier') {
                $c = Commande::where('coursier_id', $u->id)->where('statut', 'accepte')->orderByDesc('id')->first();
                if ($c) {
                    $mission = ['id' => $c->id, 'service' => $c->service];
                }
            }
            return [
                'id'        => $u->id,
                'role'      => $u->role,
                'nom'       => $u->nom,
                'prenom'    => $u->prenom,
                'telephone' => $u->telephone,
                'latitude'  => (float) $u->position_lat,
                'longitude' => (float) $u->position_lng,
                'precision' => $u->position_precision,
                'at'        => Carbon::parse($u->position_at)->toIso8601String(),
                'mission'   => $mission,
            ];
        })->values();

        return response()->json(['utilisateurs' => $liste, 'delai' => self::DELAI_EN_LIGNE]);
    }
}
