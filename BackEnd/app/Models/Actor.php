<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Actor extends Model
{
    use HasFactory;
    protected $table = 'actor';
    protected $fillable = [
        'actor_name',
        'slug',
        'country',
        'photo',
        'link_wiki',
        'descripcion',
        'status',
    ];

    public function movies()
    {
        return $this->belongsToMany(Movie::class, 'actor_in_movies', 'actor_id', 'movie_id')

            ->withTimestamps();
    }

    public function actorInMovies()
    {
        return $this->hasMany(ActorInMovie::class);
    }
    protected static function booted()
    {
        static::creating(function ($movie) {
            $movie->slug = self::createSlug($movie->actor_name);
        });
    }



    public static function createSlug($title)
    {
        return Str::slug($title);
    }
}
