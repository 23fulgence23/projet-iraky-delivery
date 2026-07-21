<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'sender_role',
        'sender_id',
        'texte',
        'lu',
    ];

    protected $casts = [
        'lu' => 'boolean',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}