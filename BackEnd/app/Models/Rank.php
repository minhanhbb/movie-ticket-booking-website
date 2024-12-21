<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rank extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'percent_discount',
        'total_order_amount',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
