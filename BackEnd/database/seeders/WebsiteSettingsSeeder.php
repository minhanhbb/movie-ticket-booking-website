<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WebsiteSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        DB::table('website_settings')->insert(
            [
                'site_name' => 'Flickhive Cinemas',
                'tagline' => 'Hãy đặt vé Xem phim ngay!',
                'email' => 'flickhivecinema@poly.com',
                'phone' => '0123456789',
                'address' => 'Tòa nhà FPT Polytechnic, Hà Nội',
                'working_hours' => '7:00 - 22:00',
                'business_license' => 'Đây là giấy phép kinh doanh',
                'facebook_link' => 'https://facebook.com/',
                'youtube_link' => 'https://youtube.com/',
                'instagram_link' => 'https://instagram.com/',
                'copyright' => 'Bản quyền © 2024 Poly Cinemas',
                'privacy_policy' => '<p>Chính sách bảo mật mặc định</p>',
                'logo' => 'default/logo.png',
                'privacy_image' => 'default/privacy.png',
                'terms_image' => 'default/terms.png',
                'about_image' => 'default/about.png',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
