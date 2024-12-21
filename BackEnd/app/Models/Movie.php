<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Movie extends Model
{
    use HasFactory;
    protected $table = 'movies';
    protected $fillable = [
        'id',
        'movie_name',
        'slug',
        'poster',
        'thumbnail',
        'trailer',
        'duration',
        'age_limit',
        'country',
        'release_date',
        'description',
        'rating',
        'views',
        'status',
    ];

    public function actor()
    {
        return $this->belongsToMany(Actor::class, 'actor_in_movies', 'movie_id', 'actor_id')
            ->withTimestamps();
    }


    public function director()
    {
        return $this->belongsToMany(Director::class, 'director_in_movie', 'movie_id', 'director_id')
            ->withTimestamps();
    }

    public function movie_category()
    {
        return $this->belongsToMany(MovieCategory::class, 'category_in_movie', 'movie_id', 'movie_category_id')
            ->withTimestamps();
    }

    public function cinema()
    {
        return $this->belongsToMany(Cinema::class, 'movie_in_cinemas', 'movie_id', 'cinema_id')
            ->withTimestamps();
    }

    public function showtimes()
    {
        return $this->hasMany(Showtime::class);
    }


    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function movieInCinemas()
    {
        return $this->hasMany(MovieInCinema::class);
    }

    public function actorInMovies()
    {
        return $this->hasMany(ActorInMovie::class);
    }

    public function directorInMovie()
    {
        return $this->hasMany(DirectorInMovie::class);
    }

    public function movieCategoryInMovie()
    {
        return $this->hasMany(MovieCategoryInMovie::class);
    }

    public function news()
    {
        return $this->hasMany(News::class);
    }

    protected static function booted()
    {
        static::creating(function ($movie) {
            $movie->slug = self::createSlug($movie->movie_name);
        });
    }



    public static function createSlug($title)
    {
        return Str::slug($title);
    }
}
