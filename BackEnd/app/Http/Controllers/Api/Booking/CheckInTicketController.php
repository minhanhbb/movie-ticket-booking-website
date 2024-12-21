<?php

namespace App\Http\Controllers\Api\Booking;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Seats;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class CheckInTicketController extends Controller
{
    public function checkInSeat(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);
        $ticket = Seats::where('code', $request->code)->first();
        if (!$ticket) {
            return $this->notFound('Không tìm thấy vé', 404);
        }
        if ($ticket->is_checked_in) {
            return $this->error('Vé đã qua sử dụng', 400);
        }
        // Cập nhật trạng thái check-in
        $ticket->is_checked_in = true;
        $ticket->save();
        return $this->success($ticket, 'Checkin thành công', 200);
    }
    public function checkInBooking(Request $request)
    {
        // Validate the booking code
        $request->validate([
            'booking_code' => 'required|string',
        ]);

        // Find the booking by booking code
        $ticket = Booking::where('booking_code', $request->booking_code)->first();

        // Check if the ticket exists
        if (!$ticket) {
            return $this->notFound('Không tìm hóa đơnđơn', 404);
        }

        // // Check if the ticket has already been used
        // if ($ticket->status == 'Đã in vé') {
        //     return $this->error('Hóa đơn này đã ', 400);
        // }
        return $this->redirectOrderDetail($ticket->id);
        // return ("http://localhost:5173/admin/orders/$ticket->id");
    }

    public function redirectOrderDetail($id)
    {
        // Redirect to the React frontend with the correct ID
        return redirect("http://localhost:5173/admin/ordersdetail/$id");
    }
}