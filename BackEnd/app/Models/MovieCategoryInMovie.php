<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovieCategoryInMovie extends Model
{
    use HasFactory;

    protected $table = 'category_in_movie';
    protected $fillable = [
        'movie_category_id',
        'movie_id',
    ];

    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }

    public function movieCategory()
    {
        return $this->belongsTo(MovieCategory::class);
    }
}
