<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ActorInMovie extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lấy danh sách tất cả movie_id từ bảng movies
        $movies = DB::table('movies')->pluck('id');

        // Lặp qua từng movie_id
        foreach ($movies as $movieId) {
            // Lấy ngẫu nhiên 5 actor_id từ bảng actors
            $randomActors = DB::table('actor')->inRandomOrder()->limit(5)->pluck('id');

            // Chuẩn bị dữ liệu để chèn
            $actorInMoviesData = $randomActors->map(function ($actorId) use ($movieId) {
                return [
                    'movie_id' => $movieId,
                    'actor_id' => $actorId,
                ];
            })->toArray();

            // Chèn dữ liệu vào bảng actor_in_movies
            DB::table('actor_in_movies')->insert($actorInMoviesData);
        }
    }
}