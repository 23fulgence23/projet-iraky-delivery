<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->integer('trophees')->default(0)->after('note');
        $table->integer('etoiles_actuelles')->default(0)->after('trophees');
        // étoiles_actuelles = étoiles accumulées depuis le dernier trophée (0 à 4)
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['trophees', 'etoiles_actuelles']);
    });
}
};
