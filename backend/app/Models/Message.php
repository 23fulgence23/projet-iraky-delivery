<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = ['commande_id', 'sender_id', 'texte', 'lu'];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }
}