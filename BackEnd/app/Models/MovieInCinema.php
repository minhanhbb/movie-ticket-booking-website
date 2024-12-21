<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovieInCinema extends Model
{
    use HasFactory;

    protected $table = 'movie_in_cinemas';
    protected $fillable = [
        'movie_id',
        'cinema_id',
    ];


    public function showtimes()
    {
        return $this->hasMany(Showtime::class);
    }

    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }

    public function cinema()
    {
        return $this->belongsTo(Cinema::class);
    }

}
