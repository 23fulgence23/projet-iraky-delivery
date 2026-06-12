<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('coursier_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('service');
            $table->string('moyen');
            $table->integer('tarif');
            $table->string('statut')->default('en_attente');
            // en_attente → negociable → accepte → termine → refuse
            $table->string('adresse_pickup')->nullable();
            $table->text('detail')->nullable();
            $table->string('heure_publication')->nullable();
            $table->string('heure_debut')->nullable();
            $table->string('heure_livraison')->nullable();
            $table->date('date')->nullable();
            $table->integer('note')->nullable(); // étoile donnée par client
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};