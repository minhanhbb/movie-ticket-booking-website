<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Fetch all cinema IDs from the cinema table
        $cinemaIds = DB::table('cinema')->pluck('id');

        // Iterate through each cinema and create rooms for them
        foreach ($cinemaIds as $cinemaId) {
            // Create 10 rooms for each cinema
            for ($i = 1; $i <= 10; $i++) {
                DB::table('room')->insert([
                    'room_name' => 'P' . $i,
                    'cinema_id' => $cinemaId,
                    'seat_map_id' => rand(1, 4),
                    'status' => '1', // Active status
                ]);
            }
        }
    }
}
