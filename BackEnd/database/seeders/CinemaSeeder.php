<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;

class CinemaSeeder extends Seeder
{
    public function run()
    {

        $client = new Client();
        $response = $client->get('https://rapchieuphim.com/api/v1/cinemas');
        $data = json_decode($response->getBody()->getContents(), true);
        // $data = array_slice($data, 0, 5);
        foreach ($data as $item) {
            if (!is_null($item['city'])) {
                $locationId = DB::table('location')
                    ->where('location_name', 'LIKE', '%' . $item['city'] . '%')
                    ->value('id');
                if (!is_null($locationId)) {
                    DB::table('cinema')->insert([
                        'cinema_name' => $item['name'],
                        'slug' => $item['slug'],
                        'city' => $item['city'],
                        'description' => $item['description'],
                        'image' => 'https://rapchieuphim.com' . $item['image'],
                        'phone' => $item['phone'] ?? '0979620125',
                        'location_id' => $locationId,
                        'cinema_address' => $item['address'] ?? 'Số 99 , VincomCenter ,32 Nguyen Huy',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
