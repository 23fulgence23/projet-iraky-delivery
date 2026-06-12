<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    // ✅ Pointe vers notifications_iraky
    protected $table = 'notifications_iraky';

    protected $fillable = [
        'user_id', 'texte', 'type', 'lu', 'commande_id',
    ];

    protected $casts = [
        'lu' => 'boolean',
    ];
}