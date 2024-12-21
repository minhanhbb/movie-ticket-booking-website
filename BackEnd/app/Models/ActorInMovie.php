<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActorInMovie extends Model
{
    use HasFactory;

    protected $table = 'actor_in_movies';
    protected $fillable = [
        'actor_id',
        'movie_id',
    ];

    public function actor()
    {
        return $this->belongsTo(Actor::class);
    }

    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }


}
