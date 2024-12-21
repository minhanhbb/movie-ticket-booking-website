<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Director extends Model
{
    use HasFactory;
    protected $table = 'director';
    protected $fillable = [
        'director_name',
        'slug',
        'photo',
        'descripcion',
        'country',
        'status',
        'link_wiki',
    ];

    public function movies()
    {
        return $this->belongsToMany(Movie::class, 'director_in_movie', 'director_id', 'movie_id')

            ->withTimestamps();
    }

    public function directorInMovie()
    {
        return $this->hasMany(DirectorInMovie::class);
    }
    protected static function booted()
    {
        static::creating(function ($movie) {
            $movie->slug = self::createSlug($movie->director_name);
        });
    }



    public static function createSlug($title)
    {
        return Str::slug($title);
    }
}
