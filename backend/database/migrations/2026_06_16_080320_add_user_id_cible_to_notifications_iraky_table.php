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
    Schema::table('notifications_iraky', function (Blueprint $table) {
        $table->unsignedBigInteger('user_id_cible')->nullable()->after('commande_id');
    });
}

public function down(): void
{
    Schema::table('notifications_iraky', function (Blueprint $table) {
        $table->dropColumn('user_id_cible');
    });
}
};
