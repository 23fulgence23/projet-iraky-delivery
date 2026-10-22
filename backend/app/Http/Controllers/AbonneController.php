<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AbonneController extends Controller
{
    public function stats()
    {
        return response()->json($this->calculer());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'device_id' => ['required', 'string', 'min:8', 'max:64', 'regex:/^[A-Za-z0-9._-]+$/'],
        ]);

        DB::table('abonnes_portail')->insertOrIgnore([
            'device_id'  => $data['device_id'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json($this->calculer());
    }

    private function utilisateurs()
    {
        $q = DB::table('users');
        if (Schema::hasColumn('users', 'role')) {
            $q->whereIn('role', ['client', 'coursier']);
        }
        return $q;
    }

    private function calculer(): array
    {
        $debutMois = Carbon::now()->startOfMonth();

        $utilisateurs = $this->utilisateurs()->count();
        $visiteurs    = DB::table('abonnes_portail')->count();
        $total        = $utilisateurs + $visiteurs;

        $nouveaux = DB::table('abonnes_portail')->where('created_at', '>=', $debutMois)->count();
        if (Schema::hasColumn('users', 'created_at')) {
            $nouveaux += $this->utilisateurs()->where('created_at', '>=', $debutMois)->count();
        }
        $nouveaux = min($nouveaux, $total);

        $avant = $total - $nouveaux;
        $taux  = $avant > 0
            ? round(($nouveaux / $avant) * 100, 1)
            : ($nouveaux > 0 ? 100.0 : 0.0);

        return [
            'total'           => $total,
            'utilisateurs'    => $utilisateurs,
            'visiteurs'       => $visiteurs,
            'nouveaux_mois'   => $nouveaux,
            'taux_croissance' => $taux,
        ];
    }
}
