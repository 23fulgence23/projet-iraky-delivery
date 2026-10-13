<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('abonnement_paiements')) {
            Schema::create('abonnement_paiements', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->string('numero_envoi');
                $table->string('reference');
                $table->timestamp('paye_le');
                $table->unsignedInteger('montant')->default(10000);
                $table->string('statut')->default('en_attente'); // en_attente | valide | rejete
                $table->string('motif_rejet', 255)->nullable();
                $table->foreignId('traite_par')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('traite_le')->nullable();
                $table->timestamps();
                $table->index(['user_id', 'statut']);
            });
        }

        // Les coursiers deja actifs, sans echeance, recoivent un mois a partir d'aujourd'hui
        DB::table('users')
            ->where('role', 'coursier')
            ->where('statut', 'actif')
            ->whereNull('abonnement_expire')
            ->update(['abonnement_expire' => now()->addMonth()]);
    }

    public function down(): void
    {
        Schema::dropIfExists('abonnement_paiements');
    }
};
