<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'latitude')) {
                $table->decimal('latitude', 10, 7)->nullable();
            }
            if (!Schema::hasColumn('users', 'longitude')) {
                $table->decimal('longitude', 10, 7)->nullable();
            }
            if (!Schema::hasColumn('users', 'localisation')) {
                $table->string('localisation')->nullable();
            }
            if (!Schema::hasColumn('users', 'photo_recto')) {
                $table->string('photo_recto')->nullable();
            }
            if (!Schema::hasColumn('users', 'photo_verso')) {
                $table->string('photo_verso')->nullable();
            }
            if (!Schema::hasColumn('users', 'note')) {
                $table->decimal('note', 3, 1)->default(0);
            }
            if (!Schema::hasColumn('users', 'nb_missions')) {
                $table->integer('nb_missions')->default(0);
            }
            if (!Schema::hasColumn('users', 'nb_terminees')) {
                $table->integer('nb_terminees')->default(0);
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'latitude', 'longitude', 'localisation',
                'photo_recto', 'photo_verso', 'note',
                'nb_missions', 'nb_terminees',
            ]);
        });
    }
};