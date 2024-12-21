<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovieCategory extends Model
{
    use HasFactory;
    protected $table = 'movie_category';
    protected $fillable = [
        'category_name',
        'descripcion',
        'status',
    ];

    public function movies()
    {
        return $this->belongsToMany(Movie::class, 'category_in_movie', 'movie_category_id', 'movie_id')

            ->withTimestamps();
    }

    public function movieCategoryInMovie()
    {
        return $this->hasMany(MovieCategoryInMovie::class);
    }
}
