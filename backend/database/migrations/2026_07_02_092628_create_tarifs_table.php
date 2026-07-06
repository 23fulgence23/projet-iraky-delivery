<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
==================================================================
 Commande pour générer ce fichier au bon endroit (nom horodaté) :
   php artisan make:migration create_tarifs_table

 Puis colle ce contenu dedans, et lance :
   php artisan migrate
==================================================================
*/

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tarifs', function (Blueprint $table) {
            $table->id();
            $table->string('cle')->unique();      // ex: "tarif_pieton"
            $table->string('titre');               // ex: "Tarif piéton"
            $table->string('valeur');               // ex: "5000" ou "30"
            $table->string('unite')->default('Ar'); // ex: "Ar", "jours"
            $table->string('couleur')->default('#10b981'); // hex pour l'affichage
            $table->timestamps();
        });

        // ✅ Valeurs par défaut — reprend exactement ce qui était codé en dur
        // dans le frontend, pour ne rien changer visuellement au premier chargement.
        DB::table('tarifs')->insert([
            ['cle' => 'tarif_pieton',   'titre' => 'Tarif piéton',                'valeur' => '5000',  'unite' => 'Ar',    'couleur' => '#10b981', 'created_at' => now(), 'updated_at' => now()],
            ['cle' => 'tarif_velo',     'titre' => 'Tarif vélo',                  'valeur' => '6000',  'unite' => 'Ar',    'couleur' => '#3b82f6', 'created_at' => now(), 'updated_at' => now()],
            ['cle' => 'tarif_moto',     'titre' => 'Tarif moto',                  'valeur' => '8000',  'unite' => 'Ar',    'couleur' => '#f59e0b', 'created_at' => now(), 'updated_at' => now()],
            ['cle' => 'tarif_voiture',  'titre' => 'Tarif voiture',               'valeur' => '12000', 'unite' => 'Ar',    'couleur' => '#ef4444', 'created_at' => now(), 'updated_at' => now()],
            ['cle' => 'abonnement',     'titre' => 'Abonnement mensuel coursier', 'valeur' => '10000', 'unite' => 'Ar',    'couleur' => '#FFD700', 'created_at' => now(), 'updated_at' => now()],
            ['cle' => 'duree_abonnement','titre' => 'Durée abonnement',           'valeur' => '30',    'unite' => 'jours', 'couleur' => '#8b5cf6', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('tarifs');
    }
};