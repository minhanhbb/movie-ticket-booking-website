<?php

namespace Database\Seeders;

use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SeatLayoutSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('seat_layouts')->insert([
            [

                'name' => 'Layout 12x12',
                'rows' => 12,
                'columns' => 12,
                'row_regular_seat' => 5,
                'row_vip_seat' => 5,
                'row_couple_seat' => 2,
                'status' => 'Bản nháp',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [

                'name' => 'Layout 13x13',
                'rows' => 13,
                'columns' => 13,
                'row_regular_seat' => 5,
                'row_vip_seat' => 6,
                'row_couple_seat' => 2,
                'status' => 'Bản nháp',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [

                'name' => 'Layout 14x14',
                'rows' => 14,
                'columns' => 14,
                'row_regular_seat' => 5,
                'row_vip_seat' => 7,
                'row_couple_seat' => 2,
                'status' => 'Bản nháp',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Layout 15x15',
                'rows' => 15,
                'columns' => 15,
                'row_regular_seat' => 5,
                'row_vip_seat' => 8,
                'row_couple_seat' => 2,
                'status' => 'Bản nháp',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
