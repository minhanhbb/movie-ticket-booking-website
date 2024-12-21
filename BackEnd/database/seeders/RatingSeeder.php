<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RatingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all movie IDs
        $movies = DB::table('movies')->pluck('id');

        // Array of possible comments
        $comments = [
            'Phim hay quá!',
            'Nhân vật quá đẹp trai!',
            'Cốt truyện hấp dẫn và đầy cảm xúc.',
            'Hài hước, vui nhộn, nhưng cũng không thiếu những khoảnh khắc cảm động.',
            'Đạo diễn đã làm rất tốt việc xây dựng nhân vật.',
            'Mình rất thích diễn xuất của các diễn viên trong phim này.',
            'Một bộ phim không thể bỏ qua nếu bạn yêu thích thể loại hành động.',
            'Cảnh quay đẹp mắt, âm nhạc tuyệt vời!',
            'Mặc dù có vài chỗ hơi dài dòng, nhưng overall rất ấn tượng.',
            'Kết thúc quá bất ngờ, khiến mình phải suy nghĩ rất lâu!',
        ];

        // Loop through each movie
        foreach ($movies as $movieId) {

            // Get 5 random users as reviewers (actors)
            $randomActors = DB::table('users')->inRandomOrder()->limit(5)->pluck('id');

            // Prepare data for inserting into the ratings table
            $actorInMoviesData = $randomActors->map(function ($actorId) use ($movieId, $comments) {
                // Select a random comment
                $randomComment = $comments[array_rand($comments)];

                return [
                    'movie_id' => $movieId,
                    'user_id' => $actorId,
                    'rating' => rand(8, 10), // Random rating between 8 and 10
                    'review' => $randomComment, // Randomly selected comment
                    'created_at' => now(),
                ];
            })->toArray();

            // Insert the data into the ratings table
            DB::table('ratings')->insert($actorInMoviesData);
        }
    }
}