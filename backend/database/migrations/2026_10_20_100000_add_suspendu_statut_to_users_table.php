<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_statut_check");
        DB::statement("ALTER TABLE users ADD CONSTRAINT users_statut_check CHECK (statut IN ('actif', 'inactif', 'rejete', 'suspendu'))");
    }

    public function down(): void
    {
        DB::statement("UPDATE users SET statut = 'inactif' WHERE statut = 'suspendu'");
        DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_statut_check");
        DB::statement("ALTER TABLE users ADD CONSTRAINT users_statut_check CHECK (statut IN ('actif', 'inactif', 'rejete'))");
    }
};
