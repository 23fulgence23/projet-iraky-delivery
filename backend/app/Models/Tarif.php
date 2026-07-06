<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tarif extends Model
{
    protected $fillable = ['service', 'label', 'prix_base', 'prix_km', 'description'];
}