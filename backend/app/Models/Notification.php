<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications_iraky';

    protected $fillable = [
        'user_id', 'texte', 'type', 'lu', 'commande_id', 'user_id_cible', // ✅ ajouté
    ];

    protected $casts = [
        'lu' => 'boolean',
    ];
}