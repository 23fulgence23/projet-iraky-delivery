<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->unique();
            $table->string('telephone');
            $table->string('adresse');
            $table->string('password');
            $table->enum('role', ['client', 'coursier', 'admin'])->default('client');
            $table->enum('statut', ['actif', 'inactif'])->default('actif');
            $table->string('cin')->nullable();
            $table->string('photo_identite')->nullable();
            $table->string('mvola_transaction')->nullable();
            $table->timestamp('abonnement_expire')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};