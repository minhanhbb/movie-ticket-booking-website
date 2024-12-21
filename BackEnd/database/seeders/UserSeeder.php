<?php

namespace Database\Seeders;

use GuzzleHttp\Client;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;  // Import the Str class

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'user_name' => 'admin',
                'sex' => 'Male',
                'password' => Hash::make('password'),
                'email' => 'admin@gmail.com',
                'phone' => '0979620125',
                'address' => 'Ha Noi',
                'fullname' => 'Admin',
                'email_verified_at' => now(),
            ],
            [
                'user_name' => 'Trần Minh Anh',
                'sex' => 'Male',
                'password' => Hash::make('password'),
                'email' => 'minhanh24hihi@gmail.com',
                'phone' => '0979620125',
                'address' => 'Ha Noi',
                'fullname' => 'Trần Minh Anh',
                'email_verified_at' => now(),
            ]
        ]);

        $client = new Client();
        $response = $client->get('https://rapchieuphim.com/api/v1/users');
        $data = json_decode($response->getBody()->getContents(), true);
        $data = array_slice($data, 1,100);

        foreach ($data as $item) {
            $randomEmail = strtolower(Str::random(10)) . '@example.com';
            $randomPhone = '0' . rand(100000000, 999999999);
            DB::table('users')->insert([
                'user_name' => $item['name'],
                'avatar' => $item['avatar'],
                'description' => $item['about'],
                'sex' => $item['sex'],
                'password' => Hash::make('password'),
                'email' => $randomEmail,
                'phone' => $item['phone'] ?? $randomPhone,
                'address' => 'Ha Noi',
                'fullname' => $item['name'],
                'email_verified_at' => now(),
            ]);
        }
    }
}
