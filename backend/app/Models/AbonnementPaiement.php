<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbonnementPaiement extends Model
{
    protected $table = 'abonnement_paiements';

    protected $fillable = [
        'user_id', 'numero_envoi', 'reference', 'paye_le', 'montant',
        'statut', 'motif_rejet', 'traite_par', 'traite_le',
    ];

    protected $casts = [
        'paye_le'  => 'datetime',
        'traite_le' => 'datetime',
    ];

    public function coursier()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
