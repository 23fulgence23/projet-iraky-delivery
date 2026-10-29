<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommandeTenue extends Model
{
    protected $table = 'commandes_tenues';

    protected $fillable = [
        'user_id', 'article', 'taille', 'quantite', 'prix_unitaire', 'total',
        'reference_paiement', 'statut', 'motif_refus', 'valide_le',
    ];

    protected $casts = ['valide_le' => 'datetime'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
