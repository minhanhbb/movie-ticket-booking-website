<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FavoriteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lấy danh sách tất cả user_id từ bảng users
        $users = DB::table('users')->pluck('id');

        // Lặp qua từng user_id
        foreach ($users as $userId) {

            // Lấy ngẫu nhiên 5 movie_id từ bảng movies
            $randomMovies = DB::table('movies')->inRandomOrder()->limit(5)->pluck('id');

            // Chuẩn bị dữ liệu để chèn vào bảng favorites
            $favoritesData = $randomMovies->map(function ($movieId) use ($userId) {
                return [
                    'user_id' => $userId,
                    'movie_id' => $movieId,
                ];
            })->toArray();

            // Chèn dữ liệu vào bảng favorites
            DB::table('favorites')->insert($favoritesData);
        }
    }
}