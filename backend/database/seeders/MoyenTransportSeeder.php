<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MoyenTransport;

/*
==================================================================
 Commande pour générer ce fichier au bon endroit :
   php artisan make:seeder MoyenTransportSeeder

 Puis colle ce contenu dedans (remplace tout), et lance :
   php artisan db:seed --class=MoyenTransportSeeder
==================================================================
*/

class MoyenTransportSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ updateOrCreate sur "nom" : si la ligne existe déjà, elle est mise
        // à jour au lieu d'être dupliquée — cette commande est donc sûre à
        // relancer plusieurs fois sans jamais créer de doublons.
        $defauts = [
            ['nom' => 'Piéton',  'icone' => '🚶', 'prix' => 5000,  'duree_estimee' => 50],
            ['nom' => 'Vélo',    'icone' => '🚲', 'prix' => 6000,  'duree_estimee' => 40],
            ['nom' => 'Moto',    'icone' => '🏍️', 'prix' => 8000,  'duree_estimee' => 25],
            ['nom' => 'Voiture', 'icone' => '🚗', 'prix' => 12000, 'duree_estimee' => 20],
        ];

        foreach ($defauts as $moyen) {
            MoyenTransport::updateOrCreate(
                ['nom' => $moyen['nom']],
                $moyen
            );
        }
    }
}