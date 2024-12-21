<?php

namespace Database\Seeders;

use GuzzleHttp\Client;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $client = new Client();
        $response = $client->get('https://provinces.open-api.vn/api/p/');
        $data = json_decode($response->getBody()->getContents(), true);

        foreach ($data as $item) {
            if (!is_null($item['name'])) {
                $existingLocation = DB::table('location')->where('location_name', $item['name'])->first();
                if (!$existingLocation) {
                    DB::table('location')->insert([
                        'location_name' => $item['name'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
