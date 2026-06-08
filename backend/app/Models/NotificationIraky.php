<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationIraky extends Model
{
    protected $table = 'notifications_iraky';

    protected $fillable = ['user_id', 'texte', 'type', 'lu', 'commande_id'];
}