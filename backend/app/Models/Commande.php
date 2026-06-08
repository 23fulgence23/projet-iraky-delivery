<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $fillable = [
        'client_id', 'coursier_id', 'service', 'moyen', 'tarif',
        'statut', 'adresse_pickup', 'detail',
        'heure_publication', 'heure_debut', 'heure_livraison',
        'date', 'note',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function coursier()
    {
        return $this->belongsTo(User::class, 'coursier_id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}