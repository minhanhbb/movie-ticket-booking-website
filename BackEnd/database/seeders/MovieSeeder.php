<?php

namespace Database\Seeders;

use App\Traits\RandomDateTrait;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class MovieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    use RandomDateTrait;
    public function run(): void
    {
        $client = new Client();
        $response = $client->get('https://rapchieuphim.com/api/v1/movies');
        $data = json_decode($response->getBody()->getContents(), true);
        $data = array_slice($data, 0, 20);  // Limit to first 20 movies

        foreach ($data as $item) {
            $poster = $item['poster'];

            // Check if the poster is a relative URL
            if (strpos($poster, 'http') === false) {
                $poster = 'https://rapchieuphim.com' . $poster;
            }

            // Check if the poster exists, if not, skip this movie
            try {
                $response = $client->head($poster);
                if ($response->getStatusCode() !== 200) {
                    // Nếu áp phích không tồn tại, hãy bỏ qua bộ phim này
                    Log::warning("Poster not found for movie: {$item['name']}, skipping.");
                    continue;
                }
            } catch (\Exception $e) {
                // Nếu có lỗi kiểm tra áp phích, hãy bỏ qua phim
                Log::warning("Error checking poster for movie: {$item['name']}, skipping. Error: {$e->getMessage()}");
                continue;
            }

            // Nếu áp phích hợp lệ, hãy chèn dữ liệu phim vào cơ sở dữ liệu
            DB::table('movies')->insert([
                'movie_name' => $item['name'],
                'slug' => $item['slug'],
                'country' => $item['country'],
                'poster' => $poster,
                'duration' => (int)str_replace(' phút', '', $item['duration']),
                'release_date' => $this->randomDate('2024-10-01', now()),
                'age_limit' => $item['age_restricted'],
                'description' => $item['description'],
                'trailer' => $item['trailer'],
                'views' => rand(20, 50),
                'rating' => rand(7, 10),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
