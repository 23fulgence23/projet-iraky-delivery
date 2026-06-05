<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
            protected $fillable = [
                'nom', 'prenom', 'email', 'telephone', 'adresse',
                'password', 'role', 'statut', 'cin',
                'photo_identite', 'photo_verso',
                'mvola_transaction', 'abonnement_expire',
                'localisation', 'latitude', 'longitude',
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
}