<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategorySeat extends Model
{
    use HasFactory;
    protected $table="category_seat";

    protected $fillable = [
        'name',
        'couple',
    ];

    public function seats()
    {
        return $this->hasMany(Seats::class, 'category_seat_id');
    }
}
