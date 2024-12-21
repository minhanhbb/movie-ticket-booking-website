<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class DirectorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $client = new Client();
        $response = $client->get('https://rapchieuphim.com/api/v1/directors');
        $data = json_decode($response->getBody()->getContents(), true);
        $data = array_slice($data, 0, 10);
        foreach ($data as $item) {
            if (!empty($item['photo'])) {
                $photo = $item['photo'];

                // Check if the photo is a relative URL
                if (strpos($photo, 'http') === false) {
                    $photo = 'https://rapchieuphim.com' . $photo;
                }

                // Check if the photo exists, if not, skip this movie
                try {
                    $response = $client->head($photo);
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
                DB::table('director')->insert([
                    'director_name' => $item['name'],
                    'slug' => $item['slug'],
                    'photo' => $photo,
                    'descripcion' => $item['description'],
                    'country' => $item['country'],
                    'link_wiki' => 'https://vi.wikipedia.org/wiki/' . $item['name'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
