<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $fillable = [
        'client_id', 'coursier_id', 'service', 'moyen', 'tarif',
        'statut', 'detail', 'adresse_pickup',
        'heure_publication', 'heure_debut', 'heure_livraison',
        'note_coursier', 'accord_client', 'accord_coursier',
    ];

    protected $casts = [
        'accord_client'  => 'boolean',
        'accord_coursier'=> 'boolean',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function coursier()
    {
        return $this->belongsTo(User::class, 'coursier_id');
    }
}