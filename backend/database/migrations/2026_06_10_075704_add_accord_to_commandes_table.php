<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('commandes', function (Blueprint $table) {
            if (!Schema::hasColumn('commandes', 'accord_client')) {
                $table->boolean('accord_client')->default(false);
            }
            if (!Schema::hasColumn('commandes', 'accord_coursier')) {
                $table->boolean('accord_coursier')->default(false);
            }
            if (!Schema::hasColumn('commandes', 'adresse_pickup')) {
                $table->string('adresse_pickup')->nullable();
            }
            if (!Schema::hasColumn('commandes', 'heure_publication')) {
                $table->string('heure_publication')->nullable();
            }
            if (!Schema::hasColumn('commandes', 'heure_debut')) {
                $table->string('heure_debut')->nullable();
            }
            if (!Schema::hasColumn('commandes', 'heure_livraison')) {
                $table->string('heure_livraison')->nullable();
            }
            if (!Schema::hasColumn('commandes', 'note_coursier')) {
                $table->integer('note_coursier')->nullable();
            }
        });
    }

    public function down(): void {
        Schema::table('commandes', function (Blueprint $table) {
            $table->dropColumn(['accord_client','accord_coursier']);
        });
    }
};