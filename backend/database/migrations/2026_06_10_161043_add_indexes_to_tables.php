<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('commandes', function (Blueprint $table) {
            $table->index('client_id');
            $table->index('coursier_id');
            $table->index('statut');
        });
        Schema::table('messages', function (Blueprint $table) {
            $table->index('commande_id');
            $table->index('sender_id');
        });
        Schema::table('notifications_iraky', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('lu');
        });
    }
    public function down(): void {}
};