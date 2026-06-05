<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            'nom' => 'Admin',
            'prenom' => 'IRAKY',
            'email' => 'admin@irakydelivery.com',
            'telephone' => '+261382126683',
            'adresse' => 'Enceinte Score BazarBe, Toliara',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'statut' => 'actif',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}