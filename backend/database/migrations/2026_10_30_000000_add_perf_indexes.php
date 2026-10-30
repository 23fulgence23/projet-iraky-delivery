<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public $withinTransaction = false;

    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }
        $index = [
            'CREATE INDEX IF NOT EXISTS idx_messages_cmd_date ON messages (commande_id, created_at)',
            'CREATE INDEX IF NOT EXISTS idx_notifs_user_date ON notifications_iraky (user_id, created_at)',
            'CREATE INDEX IF NOT EXISTS idx_commandes_client_date ON commandes (client_id, created_at)',
            'CREATE INDEX IF NOT EXISTS idx_commandes_coursier_statut ON commandes (coursier_id, statut)',
            'CREATE INDEX IF NOT EXISTS idx_commandes_statut_coursier ON commandes (statut, coursier_id)',
            'CREATE INDEX IF NOT EXISTS idx_users_role_statut ON users (role, statut)',
        ];
        foreach ($index as $sql) {
            try { DB::statement($sql); } catch (\Throwable $e) { /* on continue */ }
        }
    }

    public function down(): void {}
};
