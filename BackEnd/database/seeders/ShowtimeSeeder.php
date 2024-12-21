<?php

namespace Database\Seeders;

use App\Traits\RandomDateTrait;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ShowtimeSeeder extends Seeder
{
    use RandomDateTrait;
    public function run(): void
    {
        $rooms = DB::table('room')->pluck('id'); // Lấy danh sách các phòng
        $movies = DB::table('movies')->pluck('id'); // Lấy danh sách các phim

        $showtimes = [
            '09:00:00',
            '11:00:00',
            '13:00:00',
            '15:00:00',
            '17:00:00',
            '19:00:00',
            '21:00:00',
            '23:00:00',
        ]; // Các thời gian suất chiếu

        $showtimeData = [];

        // Tạo 10 suất chiếu ngẫu nhiên
        for ($i = 0; $i < 450; $i++) {
            $roomId = $rooms->random(); // Chọn phòng ngẫu nhiên
            $movieId = $movies->random(); // Chọn phim ngẫu nhiên
            $showtimeStart = $showtimes[array_rand($showtimes)]; // Chọn thời gian ngẫu nhiên
            $showtimeEnd = Carbon::createFromFormat('H:i:s', $showtimeStart)
                ->addHours(2)
                ->format('H:i:s'); // Tính thời gian kết thúc
            $showtimeDate = now()->addDays(rand(0, 7))->toDateString(); // Chọn ngày chiếu ngẫu nhiên trong 7 ngày tới

            $showtimeData[] = [
                'room_id' => $roomId,
                'movie_id' => $movieId,
                'showtime_date' => $showtimeDate,
                // 'showtime_date' => $this->randomDate('2023-01-01', now()->subDay()),
                'showtime_start' => $showtimeStart,
                'showtime_end' => $showtimeEnd,
                'price' => rand(45, 75) * 1000,
                'status' => '1', // Active
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Chèn vào cơ sở dữ liệu
        DB::table('showtimes')->insert($showtimeData);
    }
}
