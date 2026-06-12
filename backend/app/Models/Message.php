<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'commande_id', 'sender_id', 'sender_role',
        'texte', 'lu', 'modifie',
        'supprime_sender', 'supprime_receiver',
    ];

    protected $casts = [
        'lu'               => 'boolean',
        'modifie'          => 'boolean',
        'supprime_sender'  => 'boolean',
        'supprime_receiver'=> 'boolean',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}