<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ✅ PostgreSQL : on supprime l'ancienne contrainte CHECK, puis on en crée une nouvelle
        \DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_statut_check");
        \DB::statement("ALTER TABLE users ADD CONSTRAINT users_statut_check CHECK (statut IN ('actif', 'inactif', 'rejete'))");
    }

    public function down(): void
    {
        \DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_statut_check");
        \DB::statement("ALTER TABLE users ADD CONSTRAINT users_statut_check CHECK (statut IN ('actif', 'inactif'))");
    }
};