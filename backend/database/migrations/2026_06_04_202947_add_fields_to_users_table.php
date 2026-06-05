<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            // ✅ photo_recto — ajouter si elle n'existe pas (pas modifier)
            if (!Schema::hasColumn('users', 'photo_recto')) {
                $table->string('photo_recto')->nullable();
            }

            // ✅ photo_verso — ajouter seulement si elle n'existe pas
            if (!Schema::hasColumn('users', 'photo_verso')) {
                // after() fonctionne uniquement si photo_identite existe
                if (Schema::hasColumn('users', 'photo_identite')) {
                    $table->string('photo_verso')->nullable()->after('photo_identite');
                } else {
                    $table->string('photo_verso')->nullable();
                }
            }

            // ✅ localisation
            if (!Schema::hasColumn('users', 'localisation')) {
                if (Schema::hasColumn('users', 'adresse')) {
                    $table->string('localisation')->nullable()->after('adresse');
                } else {
                    $table->string('localisation')->nullable();
                }
            }

            // ✅ latitude
            if (!Schema::hasColumn('users', 'latitude')) {
                $table->decimal('latitude', 10, 8)->nullable();
            }

            // ✅ longitude
            if (!Schema::hasColumn('users', 'longitude')) {
                $table->decimal('longitude', 11, 8)->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(
                array_filter([
                    Schema::hasColumn('users', 'photo_recto')  ? 'photo_recto'  : null,
                    Schema::hasColumn('users', 'photo_verso')  ? 'photo_verso'  : null,
                    Schema::hasColumn('users', 'localisation') ? 'localisation' : null,
                    Schema::hasColumn('users', 'latitude')     ? 'latitude'     : null,
                    Schema::hasColumn('users', 'longitude')    ? 'longitude'    : null,
                ])
            );
        });
    }
};