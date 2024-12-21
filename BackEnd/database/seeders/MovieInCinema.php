<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MovieInCinema extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all movie IDs and cinema IDs
        $movieIds = DB::table('movies')->pluck('id');
        $cinemaIds = DB::table('cinema')->pluck('id');

        // Prepare data to insert each movie into each cinema
        $movieInCinemaData = [];

        foreach ($movieIds as $movieId) {
            foreach ($cinemaIds as $cinemaId) {
                $movieInCinemaData[] = [
                    'movie_id' => $movieId,
                    'cinema_id' => $cinemaId,
                ];
            }
        }

        // Insert all records in one query
        DB::table('movie_in_cinemas')->insert($movieInCinemaData);
    }
}