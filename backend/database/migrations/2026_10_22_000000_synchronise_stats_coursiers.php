<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        // Recalcule missions / terminees / etoiles / trophees / note de chaque coursier depuis les missions reelles
        User::where('role', 'coursier')->pluck('id')->each(
            fn ($id) => User::synchroniserStatsCoursier((int) $id)
        );
    }

    public function down(): void {}
};
