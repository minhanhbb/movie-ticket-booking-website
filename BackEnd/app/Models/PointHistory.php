<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PointHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'points_used',
        'points_earned',
        'type',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
