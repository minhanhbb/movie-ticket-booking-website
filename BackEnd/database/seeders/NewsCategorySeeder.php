<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NewsCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('news_category')->insert([
            [
                'news_category_name' => 'Hành Động',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'news_category_name' => 'Kinh dị',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'news_category_name' => 'Tình Cảm',
                'created_at' => now(),
                'updated_at' => now(),
            ]

        ]);
    }
}
