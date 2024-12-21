<?php

namespace App\Jobs;

use App\Models\Seats;
use App\Models\Booking;
use App\Models\TemporaryBooking;
use App\Events\SeatReset;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Carbon\Carbon;

class ResetSeats implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $seatIds;
    public $userId;
    /**
     * Nhận vào đối tượng ghế cần reset.
     */
    public function __construct(array $seatIds,$userId)
    {
        $this->seatIds = $seatIds;
        $this->userId = $userId;
    }

    public function handle()
    {
        $validSeatIds = [];  // Tạo một mảng để lưu trữ các seat ID hợp lệ

        foreach ($this->seatIds as $seatId) {
            $seat = Seats::find($seatId['id']);
            Log::info('Seat found with ID: ' . $seatId . ' - Seat details: ' . json_encode($seat->toArray()));

            // Kiểm tra xem ghế có tồn tại và chưa được thanh toán
            if ($seat && $seat->status == 'Reserved Until' && $seat->reserved_until < now()) {
                $validSeatIds[] = $seat->id;
                Log::info('ResetSeat job is running for seat ID: ' . $seat->id);
                $seat->delete();  // Xóa ghế chưa thanh toán
            } elseif ($seat && $seat->status == 'Booked') {
                // Ghế đã được thanh toán hoặc đã có trạng thái khác, bỏ qua việc reset
                Log::info('Seat has been booked or paid for, skipping reset for seat ID: ' . $seat->id);
            } else {
                Log::info('Seat not found or not eligible with ID: ' . $seatId);
            }
        }

        // Sau khi đã thu thập tất cả ghế hợp lệ, chỉ dispatch event một lần
        if (!empty($validSeatIds)) {
            Log::info('Broadcasting seat reset event for seats with IDs: ' . implode(', ', $validSeatIds));
            event(new SeatReset($validSeatIds,$this->userId));  // Dispatch event chỉ một lần cho tất cả các seatId hợp lệ
        } else {
            Log::info('No seats to reset, event not broadcasted.');
        }
    }
}

// class ResetSeats implements ShouldQueue
// {
//     use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

//     public $seatIds;

//     /**
//      * Nhận vào đối tượng ghế cần reset.
//      */
//     public function __construct(array $seatIds)
//     {
//         $this->seatIds = $seatIds;
//     }
//     public function handle()
//     {
//         $seatIds = [];
//         // Lặp qua các ID ghế và reset
//         // Xử lý các ghế theo ID được truyền vào
//         foreach ($this->seatIds as $seatId) {
//             $seat = Seats::find($seatId);
//             if ($seat && $seat->status == 'Reserved Until') {
//                 $seatIds[] = $seat->id;
//                 log::info('Seat found with ID: ' . $seat->id);
//                 // event(new SeatReset($seatIds));
//                 Log::info('ResetSeat job is running for seat ID: ' . $seat->id);
//                 $seat->delete();
//             } else {
//                 Log::info('Seat not found with ID: ' . $seatId);
//             }
//         }
//         // Chỉ gọi event một lần khi đã thu thập xong tất cả các seatId hợp lệ
//         if (!empty($seatIds)) {
//             event(new SeatReset($seatIds));
//             Log::info('SeatReset event dispatched for seat IDs: ' . implode(', ', $seatIds));
//         }
//     }
//     /**
//      * Thực hiện Job.
//      */
//     // public function handle(): void
//     // {
//     //     Log::info('ResetSeat job is running for seat ID: ' . $this->seat->id);

//     //     // Tìm ghế mới nhất từ cơ sở dữ liệu
//     //     $seat = Seats::find($this->seat['id']);
//     //     Log::info('Seat found with ID: ' . $seat->id);
//     //     if (!$seat) {
//     //         Log::error('Seat not found with ID: ' . $this->seat->id);
//     //         return;
//     //     }

//     //     if ($seat->status == 'Reserved Until' && $seat->reserved_until < now()) {
//     //         Log::info('Seat reserved time expired for seat ID: ' . $seat->id);

//     //         // // Tìm booking liên quan đến ghế này
//     //         // $booking = Booking::whereHas('seats', function ($query) use ($seat) {
//     //         //     $query->where('seats.id', $seat->id);
//     //         // })->first();

//     //         // if (!$booking) {
//     //         //     Log::info('No booking found for seat ID: ' . $seat->id);
//     //         //     return;
//     //         // }
//     //         // if ($booking) {
//     //         //     // Xóa các ghế liên quan khỏi bảng booking_seats
//     //         //     $booking->seats()->detach($seat->id);

//     //         //     // Xóa các combo liên quan khỏi bảng booking_combos
//     //         //     $booking->combos()->detach();

//     //         //     // Nếu không còn ghế nào trong booking, xóa booking
//     //         //     if ($booking->seats()->count() == 0) {
//     //         //         Log::info('Deleting booking ID: ' . $booking->id . ' because it has no seats left.');
//     //         //         $booking->delete();
//     //         //     }
//     //         // }
//     //         $seatId = [$seat->id];  // Nếu có nhiều ghế, bạn cần gom chúng vào mảng.
//     //         // Phát sự kiện chỉ một lần cho tất cả các ghế
//     //         broadcast(new SeatReset($seatId));
//     //         Log::info('SeatReset event broadcasted for seats: ' . implode(',', $seatId));

//     //         // Xóa ghế
//     //         // $temporaryBooking = TemporaryBooking::latest()->first();
//     //         // if ($temporaryBooking) {
//     //         //     Log::info('Deleting temporary booking for seat ID: ' . $seat->id);
//     //         //     $temporaryBooking->delete();
//     //         // }
//     //         $seat->delete();

//     //         // Xóa dữ liệu tạm nếu có

//     //         // Phát sự kiện sau khi ghế đã được xóa

//     //     } elseif ($seat->status == 'Booked') {
//     //         $seat->reserved_until = null;
//     //         $seat->save();
//     //         Log::info('Seat is still reserved or booked, no action taken for seat ID: ' . $seat->id);
//     //     }
//     // }
// }
