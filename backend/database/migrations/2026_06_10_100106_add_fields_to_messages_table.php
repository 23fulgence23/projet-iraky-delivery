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
    Schema::table('messages', function (Blueprint $table) {
        if (!Schema::hasColumn('messages', 'sender_role')) {
            $table->string('sender_role')->nullable()->after('sender_id');
        }
        if (!Schema::hasColumn('messages', 'modifie')) {
            $table->boolean('modifie')->default(false)->after('lu');
        }
        if (!Schema::hasColumn('messages', 'supprime_sender')) {
            $table->boolean('supprime_sender')->default(false)->after('modifie');
        }
        if (!Schema::hasColumn('messages', 'supprime_receiver')) {
            $table->boolean('supprime_receiver')->default(false)->after('supprime_sender');
        }
    });
}
    /**
     * Reverse the migrations.
     */
public function down(): void
{
    Schema::table('messages', function (Blueprint $table) {
        $table->dropColumn(['sender_role','modifie','supprime_sender','supprime_receiver']);
    });
}
};
