<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DirectorInMovie extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lấy danh sách tất cả movie_id từ bảng movies
        $movies = DB::table('movies')->pluck('id');

        foreach ($movies as $movieId) {
            // Lấy ngẫu nhiên 1 director_id từ bảng directors
            $randomDirectorId = DB::table('director')->inRandomOrder()->value('id');

            // Chuẩn bị dữ liệu để chèn
            $directorInMovieData = [
                'movie_id' => $movieId,
                'director_id' => $randomDirectorId,
            ];

            // Chèn dữ liệu vào bảng director_in_movies
            DB::table('director_in_movie')->insert($directorInMovieData);
        }
    }
}