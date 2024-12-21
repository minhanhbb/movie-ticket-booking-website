<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeatLayout extends Model
{
    use HasFactory;

    protected $table = 'seat_layouts';

    protected $fillable = [
        'name',
        'rows',
        'columns',
        'row_regular_seat',
        'row_vip_seat',
        'row_couple_seat',
        'status',
    ];

    // Relation to SeatMap (seat locations in the layout)
    public function seatMap()
    {
        return $this->hasMany(SeatMap::class);
    }
}
