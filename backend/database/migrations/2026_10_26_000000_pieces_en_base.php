<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            foreach (['photo_recto', 'photo_verso', 'certificat_residence'] as $c) {
                DB::statement('ALTER TABLE users ALTER COLUMN ' . $c . ' TYPE TEXT');
            }
        }
    }

    public function down(): void {}
};
