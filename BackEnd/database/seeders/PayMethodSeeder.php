<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PayMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('pay_method')->insert([
            [
                'pay_method_name' => 'Ví MoMo',

                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'pay_method_name' => 'VNPay',

                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'pay_method_name' => 'ZaloPay',

                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'pay_method_name' => 'PayPal',

                'created_at' => now(),
                'updated_at' => now(),
            ],[
                'pay_method_name' => 'Thanh Toán Tại Quầy',

                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
