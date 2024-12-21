<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;
    protected $table = 'booking';
    protected $fillable = [
        'user_id',
        'showtime_id',
        'pay_method_id',
        'amount',
        'status',
        'price_ticket',
        'price_combo',
        'barcode',
        'created_at',
        'updated_at',
        'qrcode',
        'booking_code'
    ];

    public function seats()
    {
        return $this->belongsToMany(Seats::class, 'booking_seats', 'booking_id', 'seat_id');
    }


    public function combos()
    {
        return $this->belongsToMany(Combo::class, 'booking_combos')->withPivot('quantity');
    }

    public function booking_users()
    {
        return $this->belongsToMany(User::class, 'booking_users', 'booking_id', 'user_id');
    }

    // public function booking_combos(){
    //     return $this->hasMany(BookingCombo::class);
    // }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function showtime()
    {
        return $this->belongsTo(Showtime::class,);
    }

    public function payMethod()
    {
        return $this->belongsTo(PayMethod::class, 'pay_method_id', 'id');
    }
}
