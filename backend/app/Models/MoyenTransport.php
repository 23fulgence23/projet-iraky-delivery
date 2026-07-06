<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MoyenTransport extends Model
{
    protected $table = 'moyens_transport';

    protected $fillable = ['nom', 'icone', 'prix', 'duree_estimee'];
}