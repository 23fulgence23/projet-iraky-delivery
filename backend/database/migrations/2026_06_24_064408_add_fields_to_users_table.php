<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // ✅ Colonnes manquantes pour l'inscription coursier
            if (!Schema::hasColumn('users', 'photo_recto')) {
                $table->string('photo_recto')->nullable()->after('cin');
            }
            if (!Schema::hasColumn('users', 'photo_verso')) {
                $table->string('photo_verso')->nullable()->after('photo_recto');
            }
            if (!Schema::hasColumn('users', 'latitude')) {
                $table->decimal('latitude', 10, 7)->nullable()->after('photo_verso');
            }
            if (!Schema::hasColumn('users', 'longitude')) {
                $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            }
            if (!Schema::hasColumn('users', 'localisation')) {
                $table->string('localisation')->nullable()->after('longitude');
            }
            if (!Schema::hasColumn('users', 'note')) {
                $table->decimal('note', 3, 1)->default(0)->after('localisation');
            }
            if (!Schema::hasColumn('users', 'nb_missions')) {
                $table->integer('nb_missions')->default(0)->after('note');
            }
            if (!Schema::hasColumn('users', 'trophees')) {
                $table->integer('trophees')->default(0)->after('nb_missions');
            }
            if (!Schema::hasColumn('users', 'etoiles_actuelles')) {
                $table->integer('etoiles_actuelles')->default(0)->after('trophees');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'photo_recto','photo_verso','latitude','longitude',
                'localisation','note','nb_missions','trophees','etoiles_actuelles'
            ]);
        });
    }
};