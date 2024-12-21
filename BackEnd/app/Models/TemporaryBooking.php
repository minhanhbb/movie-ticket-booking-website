<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemporaryBooking extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'reserved_showtime',
        'reserved_seats',
        'combos',
    ];

    protected $casts = [
        'reserved_showtime' => 'array',
        'reserved_seats' => 'array',
        'combos' => 'array',
    ];
}
