<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'photo_profil')) {
            Schema::table('users', function (Blueprint $table) {
                $table->text('photo_profil')->nullable();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('users', 'photo_profil')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('photo_profil');
            });
        }
    }
};
