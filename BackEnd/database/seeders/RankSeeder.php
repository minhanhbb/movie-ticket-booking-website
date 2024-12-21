<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('ranks')->insert([
            [
                'name' => 'Thành Viên',
                'total_order_amount' => 0,
                'percent_discount' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Bạc',
                'total_order_amount' => 200000,
                'percent_discount' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Vàng',
                'total_order_amount' => 500000,
                'percent_discount' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Bạch Kim',
                'total_order_amount' => 1500000,
                'percent_discount' => 12,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Kim Cương',
                'total_order_amount' => 3000000,
                'percent_discount' => 15,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
