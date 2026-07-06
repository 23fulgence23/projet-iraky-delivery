<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

/*
==================================================================
 Commande pour générer ce fichier au bon endroit (nom horodaté) :
   php artisan make:migration create_moyens_transport_table

 Puis colle ce contenu dedans, et lance :
   php artisan migrate
==================================================================
*/

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('moyens_transport', function (Blueprint $table) {
            $table->id();
            $table->string('nom');                   // ex: "Piéton", "Vélo", "Moto", "Voiture"
            $table->string('icone')->nullable();      // ex: emoji ou nom d'icône (optionnel)
            $table->decimal('prix', 10, 2);           // ex: 5000.00
            $table->integer('duree_estimee')->nullable(); // en minutes, ex: 50
            $table->timestamps();
        });

        // ✅ Valeurs par défaut — reprend exactement ta capture d'écran actuelle
        DB::table('moyens_transport')->insert([
            ['nom' => 'Piéton',  'icone' => '🚶', 'prix' => 5000,  'duree_estimee' => 50, 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Vélo',    'icone' => '🚲', 'prix' => 6000,  'duree_estimee' => 40, 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Moto',    'icone' => '🏍️', 'prix' => 8000,  'duree_estimee' => 25, 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Voiture', 'icone' => '🚗', 'prix' => 12000, 'duree_estimee' => 20, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('moyens_transport');
    }
};