<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'partage_position')) { $table->boolean('partage_position')->nullable(); }
            if (!Schema::hasColumn('users', 'position_lat'))       { $table->decimal('position_lat', 10, 7)->nullable(); }
            if (!Schema::hasColumn('users', 'position_lng'))       { $table->decimal('position_lng', 10, 7)->nullable(); }
            if (!Schema::hasColumn('users', 'position_precision')) { $table->integer('position_precision')->nullable(); }
            if (!Schema::hasColumn('users', 'position_at'))        { $table->timestamp('position_at')->nullable(); }
        });

        if (!Schema::hasTable('positions_utilisateurs')) {
            Schema::create('positions_utilisateurs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('commande_id')->nullable()->constrained('commandes')->nullOnDelete();
                $table->decimal('latitude', 10, 7);
                $table->decimal('longitude', 10, 7);
                $table->integer('precision_m')->nullable();
                $table->timestamp('created_at')->useCurrent();
                $table->index(['commande_id', 'created_at']);
                $table->index(['user_id', 'created_at']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('positions_utilisateurs');
    }
};
