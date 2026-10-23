<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('signalements')) {
            Schema::create('signalements', function (Blueprint $table) {
                $table->id();
                $table->foreignId('commande_id')->nullable()->constrained('commandes')->nullOnDelete();
                $table->foreignId('auteur_id')->constrained('users')->cascadeOnDelete();
                $table->string('auteur_role', 20);
                $table->foreignId('cible_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('motif', 40);
                $table->text('description');
                $table->string('statut', 20)->default('nouveau'); // nouveau | en_cours | resolu | rejete
                $table->text('reponse_admin')->nullable();
                $table->foreignId('traite_par')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('traite_le')->nullable();
                $table->timestamps();
                $table->index(['statut', 'created_at']);
                $table->index(['commande_id', 'auteur_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('signalements');
    }
};
