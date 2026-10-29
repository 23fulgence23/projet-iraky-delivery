<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('commandes_tenues')) {
            return;
        }
        Schema::create('commandes_tenues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('article', 10);
            $table->string('taille', 4);
            $table->unsignedSmallInteger('quantite')->default(1);
            $table->unsignedInteger('prix_unitaire');
            $table->unsignedInteger('total');
            $table->string('reference_paiement', 100);
            $table->string('statut', 20)->default('en_attente');
            $table->string('motif_refus', 255)->nullable();
            $table->timestamp('valide_le')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'statut']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commandes_tenues');
    }
};
