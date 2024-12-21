<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Showtime;
use App\Models\PayMethod;
use App\Models\Combo;
use App\Models\Room;
use App\Traits\RandomDateTrait;
use Illuminate\Support\Str;

class BookingSeeder extends Seeder
{
    use RandomDateTrait;

    public function run()
    {
        // Lấy dữ liệu mẫu
        $users = User::pluck('id');
        $showtimes = Showtime::pluck('id');
        $payMethods = PayMethod::pluck('id');
        $rooms = Room::all();

        // Seed bảng seats
        foreach ($rooms as $room) {
            for ($row = 'A'; $row <= 'D'; $row++) { // Hàng ghế từ A đến D
                for ($column = 1; $column <= 10; $column++) { // Mỗi hàng có 10 ghế
                    DB::table('seats')->insert([
                        'showtime_id' => $showtimes->random(),
                        'room_id' => $room->id,
                        'seat_name' => $row . $column,
                        'seat_column' => rand(1, 10),
                        'seat_row' => rand(1, 10),
                        'seat_type' => ['Standard', 'Couple', 'VIP'][array_rand(['Standard', 'Couple', 'VIP'])],
                        'status' => 'Reserved Until',
                        'reserved_until' => now()->addMinutes(rand(10, 60)),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        // Seed bảng booking
        $bookingIds = [];
        foreach (range(1, 1000) as $index) {
            $bookingId = DB::table('booking')->insertGetId([
                'user_id' => $users->random(),
                'showtime_id' => $showtimes->random(),
                'pay_method_id' => $payMethods->random(),
                'amount' => rand(100000, 1000000),
                'status' => ['Thanh toán thành công', 'Thanh toán thất bại', 'Đã hủy','Đang xử lý','Đã in vé'][array_rand(['Thanh toán thành công', 'Thanh toán thất bại', 'Đã hủy','Đang xử lý','Đã in vé'])],
                'created_at' => $this->randomDate('2023-01-01', now()),
                'updated_at' => now(),
            ]);
            $bookingIds[] = $bookingId;
        }

        // Seed bảng booking_combos
        $combos = Combo::pluck('id');
        foreach ($bookingIds as $bookingId) {
            foreach (range(1, rand(1, 3)) as $index) {
                DB::table('booking_combos')->insert([
                    'booking_id' => $bookingId,
                    'combo_id' => $combos->random(),
                    'quantity' => rand(1, 5),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Seed bảng booking_seats
        $seats = DB::table('seats')->pluck('id');
        foreach ($bookingIds as $bookingId) {
            foreach (range(1, rand(1, 2)) as $index) {
                DB::table('booking_seats')->insert([
                    'booking_id' => $bookingId,
                    'seat_id' => $seats->random(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
