<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        // Note = etoiles du cycle en cours : on recalcule tous les coursiers depuis leurs missions reelles
        User::where('role', 'coursier')->pluck('id')->each(
            fn ($id) => User::synchroniserStatsCoursier((int) $id)
        );
    }

    public function down(): void {}
};
