<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoryInMovieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $movies = DB::table('movies')->pluck('id');


        foreach ($movies as $movieId) {
            $randomActors = DB::table('movie_category')->inRandomOrder()->limit(3)->pluck('id');
            $actorInMoviesData = $randomActors->map(function ($actorId) use ($movieId) {
                return [
                    'movie_id' => $movieId,
                    'movie_category_id' => $actorId,
                ];
            })->toArray();
            DB::table('category_in_movie')->insert($actorInMoviesData);
        }
    }
}