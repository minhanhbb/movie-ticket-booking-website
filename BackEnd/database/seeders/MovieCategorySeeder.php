<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MovieCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Hành động',
            'Phiêu lưu',
            'Hoạt hình',
            'Tiểu sử',
            'Hài kịch',
            'Tội phạm',
            'Phim tài liệu',
            'Kịch',
            'Gia đình',
            'Tưởng tượng',
            'Lịch sử',
            'Kinh dị',
            'Nhạc kịch',
            'Bí ẩn',
            'Lãng mạn',
            'Sci-Fi',
            'Thể thao',
            'Drama',
            'Chiến tranh',
            'Phương Tây'
        ];

        $categoryData = [];

        foreach ($categories as $category) {
            $categoryData[] = [
                'category_name' => $category,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('movie_category')->insert($categoryData);
    }
}