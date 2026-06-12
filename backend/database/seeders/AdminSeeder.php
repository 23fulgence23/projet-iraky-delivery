<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Vérifier si l'admin existe déjà avant de l'insérer
        $existant = User::where('email', 'admin@iraky.com')->first();

        if ($existant) {
            $this->command->info('Admin existe déjà — aucune insertion.');
            return;
        }

        User::create([
            'nom'      => 'IRAKY',
            'prenom'   => 'Admin',
            'email'    => 'admin@iraky.com',
            'telephone'=> '+261 38 21 266 83',
            'adresse'  => 'Toliara, Madagascar',
            'password' => Hash::make('Admin@2026'),  
            'role'     => 'admin',
            'statut'   => 'actif',
        ]);

        $this->command->info('Admin créé avec succès !');
    }
}