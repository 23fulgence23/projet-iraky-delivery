<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

class TopUtilisateursController extends Controller
{
    public function show()
    {
        $admin = JWTAuth::user();
        if (!$admin || $admin->role !== 'admin') {
            abort(403, 'Accès refusé.');
        }

        // ── Coursier avec le plus de missions (terminees + en cours) ──
        $c = Commande::selectRaw(
                "coursier_id,
                 SUM(CASE WHEN statut = 'termine' THEN 1 ELSE 0 END) AS terminees,
                 SUM(CASE WHEN statut IN ('negociable','accepte') THEN 1 ELSE 0 END) AS en_cours"
            )
            ->whereNotNull('coursier_id')
            ->groupBy('coursier_id')
            ->orderByRaw("SUM(CASE WHEN statut IN ('termine','negociable','accepte') THEN 1 ELSE 0 END) DESC")
            ->orderByRaw("SUM(CASE WHEN statut = 'termine' THEN 1 ELSE 0 END) DESC")
            ->first();

        $topCoursier = null;
        if ($c && ((int) $c->terminees + (int) $c->en_cours) > 0) {
            $u = User::find($c->coursier_id);
            if ($u) {
                $terminees = (int) $c->terminees;
                $enCours   = (int) $c->en_cours;
                $topCoursier = [
                    'id'           => $u->id,
                    'nom'          => $u->nom,
                    'prenom'       => $u->prenom,
                    'missions'     => $terminees + $enCours,
                    'terminees'    => $terminees,
                    'en_cours'     => $enCours,
                    'etoiles'      => $terminees,            // 1 mission terminee = 1 etoile
                    'trophees'     => intdiv($terminees, 5), // 5 etoiles = 1 trophee
                    'etoiles_cycle' => $terminees % 5,
                ];
            }
        }

        // ── Client avec le plus de commandes ──
        $cl = Commande::selectRaw(
                "client_id,
                 COUNT(*) AS total,
                 SUM(CASE WHEN statut = 'termine' THEN 1 ELSE 0 END) AS terminees,
                 SUM(CASE WHEN statut IN ('en_attente','negociable','accepte') THEN 1 ELSE 0 END) AS en_cours"
            )
            ->groupBy('client_id')
            ->orderByRaw('COUNT(*) DESC')
            ->orderByRaw("SUM(CASE WHEN statut = 'termine' THEN 1 ELSE 0 END) DESC")
            ->first();

        $topClient = null;
        if ($cl && (int) $cl->total > 0) {
            $u = User::find($cl->client_id);
            if ($u) {
                $topClient = [
                    'id'        => $u->id,
                    'nom'       => $u->nom,
                    'prenom'    => $u->prenom,
                    'total'     => (int) $cl->total,
                    'terminees' => (int) $cl->terminees,
                    'en_cours'  => (int) $cl->en_cours,
                ];
            }
        }

        return response()->json(['coursier' => $topCoursier, 'client' => $topClient]);
    }
}
