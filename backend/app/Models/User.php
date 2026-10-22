<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'adresse',
        'password',
        'role',
        'statut',
        'cin',
        'photo_recto',
        'photo_verso',
        'photo_profil',
        'latitude',
        'longitude',
        'localisation',
        'mvola_transaction',
        'note',
        'nb_missions',
        'nb_terminees',
        'trophees',
        'etoiles_actuelles',
    ];

    protected $hidden = ['password'];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // ── Abonnement coursier : suspension automatique a l'echeance ──
    public static function suspendreAbonnementsExpires(): int
    {
        // coursiers desactives apres validation (echeance connue) : suspendus, pas en attente
        static::where('role', 'coursier')->where('statut', 'inactif')->whereNotNull('abonnement_expire')->update(['statut' => 'suspendu']);

        $expires = static::where('role', 'coursier')
            ->where('statut', 'actif')
            ->whereNotNull('abonnement_expire')
            ->where('abonnement_expire', '<', now())
            ->get();

        $nb = 0;
        foreach ($expires as $c) {
            $modifie = static::where('id', $c->id)->where('statut', 'actif')->update(['statut' => 'suspendu']);
            if (!$modifie) { continue; }
            $nb++;

            \App\Models\Notification::create([
                'user_id'     => $c->id,
                'texte'       => "⚠️ Vous n'avez pas encore payé votre abonnement : votre compte est suspendu. Envoyez le paiement et soumettez la référence pour le réactiver.",
                'type'        => 'info',
                'commande_id' => null,
            ]);

            foreach (static::where('role', 'admin')->get() as $admin) {
                \App\Models\Notification::create([
                    'user_id'     => $admin->id,
                    'texte'       => "⚠️ Abonnement échu : {$c->prenom} {$c->nom} a été suspendu automatiquement.",
                    'type'        => 'info',
                    'commande_id' => null,
                ]);
            }
        }
        return $nb;
    }

    // ── Stats coursier : source unique = les missions reelles ──
    // 1 mission terminee = 1 etoile ; 5 etoiles = 1 trophee
    public static function statsCoursier(int $id): array
    {
        $base      = Commande::where('coursier_id', $id);
        $total     = (clone $base)->count();
        $terminees = (clone $base)->where('statut', 'termine')->count();
        // Note affichee = etoiles du cycle en cours (1 mission terminee = 1 etoile, 5 etoiles = 1 trophee)
        $moyenne   = $terminees % 5;

        return [
            'nb_missions'       => $total,
            'nb_terminees'      => $terminees,
            'note'              => $moyenne,
            'trophees'          => intdiv($terminees, 5),
            'etoiles_actuelles' => $terminees % 5,
        ];
    }

    public static function synchroniserStatsCoursier(int $id): array
    {
        $stats = static::statsCoursier($id);
        static::where('id', $id)->update($stats);
        return $stats;
    }
}