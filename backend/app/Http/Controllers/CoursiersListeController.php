<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

class CoursiersListeController extends Controller
{
    // Coursiers qui peuvent recevoir une commande : comptes valides et actifs
    public static function coursiersEligibles()
    {
        return User::where('role', 'coursier')->where('statut', 'actif');
    }

    public function index()
    {
        $client = JWTAuth::user();

        $deja = Commande::where('client_id', $client->id)
            ->whereNotNull('coursier_id')
            ->pluck('coursier_id')->unique()->all();

        $tous = self::coursiersEligibles()
            ->get(['id', 'prenom', 'nom', 'photo_profil', 'note', 'trophees', 'etoiles_actuelles']);

        // Missions comptees directement dans les commandes
        $stats = Commande::whereIn('coursier_id', $tous->pluck('id'))
            ->selectRaw("coursier_id, count(*) as total, sum(case when statut = 'termine' then 1 else 0 end) as termines")
            ->groupBy('coursier_id')->get()->keyBy('coursier_id');
        $tous->each(function ($c) use ($stats) {
            $st = $stats->get($c->id);
            $c->nb_missions  = (int) ($st->total ?? 0);
            $c->nb_terminees = (int) ($st->termines ?? 0);
        });

        // Groupe 1 : les meilleurs (missions terminees, puis note)
        $top = $tous->where('nb_terminees', '>', 0)
            ->sort(fn($a, $b) => [$b->nb_terminees, (float) $b->note] <=> [$a->nb_terminees, (float) $a->note])
            ->take(5)->values();
        $idsTop = $top->pluck('id')->all();

        // Groupe 2 : ceux qui ont deja travaille pour ce client
        $habituels = $tous
            ->filter(fn($c) => in_array($c->id, $deja) && !in_array($c->id, $idsTop))
            ->sortByDesc('nb_terminees')->values();
        $idsHab = $habituels->pluck('id')->all();

        // Groupe 3 : les autres
        $autres = $tous
            ->filter(fn($c) => !in_array($c->id, $idsTop) && !in_array($c->id, $idsHab))
            ->sortBy('prenom')->values();

        $fmt = fn($c, $g) => [
            'id'           => $c->id,
            'nom_complet'  => trim($c->prenom . ' ' . $c->nom),
            'photo_profil' => $c->photo_profil,
            'note'         => (float) $c->note,
            'nb_terminees' => (int) $c->nb_terminees,
            'nb_missions'  => (int) $c->nb_missions,
            'trophees'     => (int) $c->trophees,
            'etoiles'      => (int) $c->etoiles_actuelles,
            'groupe'       => $g,
        ];

        return response()->json([
            'top'       => $top->map(fn($c) => $fmt($c, 'top'))->values(),
            'habituels' => $habituels->map(fn($c) => $fmt($c, 'habituel'))->values(),
            'autres'    => $autres->map(fn($c) => $fmt($c, 'autre'))->values(),
        ]);
    }
}
