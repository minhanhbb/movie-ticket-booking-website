<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seats extends Model
{
    use HasFactory;
    protected $table = 'seats';
    protected $fillable = [
        'seat_name',
        'room_id',
        'showtime_id',
        'seat_row',
        'seat_column',
        'number',
        'seat_type',
        'status'
    ];

    public function isAvailable()
    {
        return is_null($this->reserved_until || now()->greaterThan($this->reserved_until));
    }

    public function reserveForUser()
    {
        // Đặt ghế và giữ trong thời gian (5 phút mặc định)
        $this->reserved_until = now()->addMinutes(5);
        $this->status = 'Reserved Until';
        $this->save();
    }

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id', 'id');
    }

    public function showtime()
    {
        return $this->belongsTo(Showtime::class, 'showtime_id', 'id');
    }
    public function bookings()
    {
        return $this->belongsToMany(Booking::class, 'booking_seats', 'seat_id', 'booking_id');
    }

    public static function updateSeatsStatus(array $seatIds, string $newStatus)
    {
        return self::whereIn('id', $seatIds)
            ->update(['status' => $newStatus]);
    }
}
