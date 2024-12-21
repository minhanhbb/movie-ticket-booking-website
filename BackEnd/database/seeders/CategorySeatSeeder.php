<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('category_seat')->insert([
            [
                'name' => 'Standard',
                'couple' => false,
            ],
            [
                'name' => 'Vip',
                'couple' => false,
            ],
            [
                'name' => 'Couple',
                'couple' => true,
            ],
        ]);
    }
}
