<?php

namespace App\Services\BookingStaff\Steps;

use App\Jobs\ResetSeats;
use App\Models\Seats;
use App\Services\Booking\Handlers\AbstractBookingStep;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Session;
use App\Http\Requests\SeatRequet;
use Illuminate\Http\JsonResponse;

class SelectSeats extends AbstractBookingStep
{
    protected function process(Request $request): ?JsonResponse
    {

        $seats = $request->input('seats');
        Log::info('Seats: ' . json_encode($seats));
        // Xóa phần này vì nó không cần thiết

        if (!$seats) {
            return response()->json(['status' => false, 'message' => 'Please select at least one seat.'], 400);
        }


        return null;
        // $existingSeats = [];
        // $seatDataList = [];

        // if (is_array($seats)) {
        //     foreach ($seats as $seatData) {
        //         // Kiểm tra xem ghế đã tồn tại
        //         $seat = Seats::where('seat_name', $seatData['seat_name'])
        //             ->where('seat_row', $seatData['seat_row'])
        //             ->where('seat_column', $seatData['seat_column'])
        //             ->where('room_id', $seatData['room_id'])
        //             ->first();

        //         if ($seat) {
        //             // Lưu ghế đã tồn tại vào danh sách lỗi
        //             $existingSeats[] = $seat->toArray();
        //         } else {
        //             // Tạo ghế mới
        //             $seatCreate = Seats::create($seatData);

        //             if ($seatCreate) {
        //                 $seatDataList[] = $seatCreate;
        //                 $seatCreate->reserveForUser();
        //             } else {
        //                 return response()->json(['status' => false, 'message' => 'Failed to create seat.'], 500);
        //             }
        //         }
        //     }

        //     // Nếu có ghế đã tồn tại, trả về danh sách các ghế đó
        //     if (!empty($existingSeats)) {
        //         return response()->json(['status' => false, 'message' => 'Some seats already exist.', 'data' => $existingSeats], 400);
        //     }

        //     // Nếu tạo ghế thành công, dispatch job cho tất cả ghế đã tạo
        //     if (!empty($seatDataList)) {
        //         $this->dispatchResetSeatsJob($seatDataList);
        //         // Lưu thông tin ghế vào session
        //         Session::put('seats', $seatDataList);
        //         Log::info('Seats Session: ' . json_encode(session('seats')));
        //     }
        // }
        // return null;
        // return response()->json([
        //     'status' => true,
        //     'message' => 'Selected seats successfully.',
        //     'data' => $seatDataList
        // ]);
    }

    private function dispatchResetSeatsJob(array $seatIds): void
    {
        // Dispatch một job với toàn bộ các ID ghế đã được tạo
        ResetSeats::dispatch($seatIds)->delay(now()->addMinutes(5));
    }

}
