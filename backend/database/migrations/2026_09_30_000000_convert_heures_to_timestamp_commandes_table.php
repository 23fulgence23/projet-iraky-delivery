<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Convertit heure_publication, heure_debut, heure_livraison de string
     * vers timestamp. Gère defensivement deux formats existants possibles :
     *  - "HH:MM" (ancien format, juste l'heure) -> complete avec la date du jour
     *  - "YYYY-MM-DD HH:MM:SS" (nouveau format datetime complet) -> converti direct
     * Toute valeur vide ou invalide devient NULL (colonnes deja nullable).
     */
    public function up(): void
    {
        $colonnes = ['heure_publication', 'heure_debut', 'heure_livraison'];

        foreach ($colonnes as $colonne) {
            DB::statement("
                ALTER TABLE commandes
                ALTER COLUMN {$colonne} TYPE timestamp USING (
                    CASE
                        WHEN {$colonne} ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
                            THEN {$colonne}::timestamp
                        WHEN {$colonne} ~ '^[0-9]{2}:[0-9]{2}'
                            THEN (CURRENT_DATE + {$colonne}::time)
                        ELSE NULL
                    END
                )
            ");
        }
    }

    /**
     * Revient au format string (heure seule au format HH:MM:SS) en cas de rollback.
     */
    public function down(): void
    {
        $colonnes = ['heure_publication', 'heure_debut', 'heure_livraison'];

        foreach ($colonnes as $colonne) {
            DB::statement("
                ALTER TABLE commandes
                ALTER COLUMN {$colonne} TYPE varchar(255) USING
                    to_char({$colonne}, 'HH24:MI:SS')
            ");
        }
    }
};
