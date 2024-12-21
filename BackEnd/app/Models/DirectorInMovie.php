<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DirectorInMovie extends Model
{
    use HasFactory;

    protected $table = 'director_in_movie';
    protected $fillable = [
        'director_id ',
        'movie_id',
    ];

    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }

    public function director()
    {
        return $this->belongsTo(Director::class);
    }
}