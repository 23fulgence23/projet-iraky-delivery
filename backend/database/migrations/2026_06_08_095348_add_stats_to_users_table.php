<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'note')) {
                $table->decimal('note', 3, 1)->default(0)->after('cin');
            }
            if (!Schema::hasColumn('users', 'nb_missions')) {
                $table->integer('nb_missions')->default(0)->after('note');
            }
            if (!Schema::hasColumn('users', 'nb_terminees')) {
                $table->integer('nb_terminees')->default(0)->after('nb_missions');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['note', 'nb_missions', 'nb_terminees']);
        });
    }
};