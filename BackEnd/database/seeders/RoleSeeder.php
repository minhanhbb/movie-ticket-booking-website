<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('role')->insert([
            [
                'role_type' => 'Admin',
                'description' => 'Admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'role_type' => 'Manager',
                'description' => 'Manager',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'role_type' => 'Staff',
                'description' => 'Staff',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'role_type' => 'User',
                'description' => 'User',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
