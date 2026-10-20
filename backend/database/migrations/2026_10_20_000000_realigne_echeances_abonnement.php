<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Echeance = inscription + 30 jours (fin de journee), pour les coursiers sans paiement valide
        $coursiers = DB::table('users')->where('role', 'coursier')
            ->whereIn('statut', ['actif', 'suspendu'])->get(['id', 'created_at']);

        foreach ($coursiers as $c) {
            $aPaye = DB::table('abonnement_paiements')->where('user_id', $c->id)->where('statut', 'valide')->exists();
            if ($aPaye) { continue; }
            $debut = $c->created_at ? Carbon::parse($c->created_at) : now();
            DB::table('users')->where('id', $c->id)
                ->update(['abonnement_expire' => $debut->copy()->addDays(30)->endOfDay()]);
        }
    }

    public function down(): void {}
};
