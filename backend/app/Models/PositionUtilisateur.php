<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PositionUtilisateur extends Model
{
    protected $table = 'positions_utilisateurs';
    public $timestamps = false;

    protected $fillable = ['user_id', 'commande_id', 'latitude', 'longitude', 'precision_m'];
    protected $casts = ['created_at' => 'datetime'];
}
