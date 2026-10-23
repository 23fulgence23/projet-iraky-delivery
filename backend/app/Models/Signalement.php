<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Signalement extends Model
{
    protected $table = 'signalements';

    protected $fillable = [
        'commande_id', 'auteur_id', 'auteur_role', 'cible_id', 'motif', 'description',
        'statut', 'reponse_admin', 'traite_par', 'traite_le',
    ];

    protected $casts = ['traite_le' => 'datetime'];

    public function auteur()   { return $this->belongsTo(User::class, 'auteur_id'); }
    public function cible()    { return $this->belongsTo(User::class, 'cible_id'); }
    public function commande() { return $this->belongsTo(Commande::class, 'commande_id'); }
}
