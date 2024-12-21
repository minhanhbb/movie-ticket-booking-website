<?php

namespace App\Http\Controllers\Api\Booking;

use App\Events\InvoiceCreated;
use App\Events\InvoiceSendMail;
use App\Events\SeatSelected;
use App\Http\Controllers\Controller;
use App\Http\Requests\Booking\TicketBookingStaffRequest;
use App\Jobs\ResetSeats;
use App\Mail\InvoiceMail;
use App\Models\Booking;
use App\Models\Combo;
use App\Models\Room;
use App\Models\Seats;
use App\Models\TemporaryBooking;
use App\Models\User;
use App\Services\BookingStaff\TicketBookingService as BookingStaffTicketBookingService;
use App\Services\Ranks\RankService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Milon\Barcode\Facades\DNS1D;
use Milon\Barcode\Facades\DNS1DFacade;
use Picqer\Barcode\BarcodeGeneratorPNG;
use Picqer\Barcode\BarcodeGenerator;


class BookingStaffController extends Controller
{
    protected BookingStaffTicketBookingService $ticketBookingService;

    protected RankService $rankService;

    public function __construct(BookingStaffTicketBookingService $ticketBookingService,RankService $rankService)
    {
        $this->ticketBookingService = $ticketBookingService;
        $this->rankService = $rankService;
    }

    public function bookTicket(TicketBookingStaffRequest $request)
    {
        try {
            Cache::put('transaction_data', [
                'transaction' => $request->all(),
                'user_id' => Auth::user()->id
            ], 300);
            $data = $this->ticketBookingService->bookingTicket($request);

            if ($data instanceof JsonResponse) {
                return $data;  // Trả về URL thanh toán hoặc lỗi nếu có
            }

            if (Cache::get('booking')) {
                $bookingData = Cache::get('booking');
                Log::info("id :".$bookingData);
                $this->bookTicketBarcode($bookingData);
                $booking = $this->ticketBookingService->bookingmapdata($bookingData);
                return response()->json([
                    'status' => true,
                    'message' => 'Đặt vé thành công',
                    'booking' => $booking
                ]);
            }
            return $this->error('Đặt vé thất bại', 500);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function bookTicketBarcode(int $id)
    {
        $booking = Booking::find($id);
        Log::info("booking: ".$booking);
        $generator = new BarcodeGeneratorPNG();
            $barcode = $generator->getBarcode($booking->id, BarcodeGenerator::TYPE_CODE_128);

            // Tạo tên file duy nhất cho mã vạch (dựa vào booking ID)
            $fileName = 'barcode_' . $booking->id . '.png';

            // Lưu mã vạch vào thư mục 'public/barcodes'
            Storage::put('public/barcodes/' . $fileName, $barcode);

            // Đưa đường dẫn đến mã vạch vào phương thức uploadImage
            $filePath = storage_path('app/public/barcodes/' . $fileName);
            $imageUrl = $this->uploadImage($filePath); // Gửi ảnh lên ImgBB

            // Lưu đường dẫn của ảnh mã vạch vào cơ sở dữ liệu (URL từ ImgBB)
            $booking->barcode = $imageUrl;
            $booking->save();
        return $booking;
    }

    public function checkuser(Request $request){
        $email = $request->input('email');
        $user = User::where('email', $email)->first();
        if ($user) {
            return response()->json([
                'status' => true,
                'message' => 'success.',
                'user' => $user
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy người dùng.'
            ]);
        }
    }
    public function confirmBooking(Request $request)
    {
        $id = $request->input('id');
        $booking = Booking::find($id);
        $booking->status = 'Thanh toán thành công';
        $booking->save();
        $this->rankService->points($booking);
        session()->flush();
        return redirect('http://localhost:5173/admin/ordersdetail/'.$id);
    }


    public function selectSeats(Request $request)
    {
        $seats = $request->input('seats'); // Ghế người dùng chọn

        // Kiểm tra nếu không có ghế được chọn
        if (empty($seats)) {
            return response()->json(['status' => false, 'message' => 'Please select at least one seat.'], 400);
        }
        if (is_array($seats) && count($seats) > 10) {
            return response()->json(['status' => false, 'message' => 'You can only select up to 10 seats.'], 400);
        }

        if (!$seats) {
            return response()->json(['status' => false, 'message' => 'Please select at least one seat.'], 400);
        }
        // Sắp xếp các ghế đã chọn theo `seat_name` (theo tên ghế)
        $gapIssue = $this->hasGapIssue($seats);
        if ($gapIssue) {
            return $gapIssue;  // Trả về lỗi nếu có khoảng trống
        }
        // Nếu không có lỗi, tiếp tục xử lý ghế đã chọn
        $saveSeats = $this->saveSeats($seats);
        if ($saveSeats) {
            return $saveSeats;
        }
    }

    public function saveSeats($seats)
    {
        if (is_array($seats)) {
            try {
                // Bắt đầu transaction
                DB::beginTransaction();

                $existingSeats = [];
                $seatDataList = [];

                foreach ($seats as $seatData) {
                    // Kiểm tra xem ghế đã tồn tại
                    $seat = Seats::where('seat_name', $seatData['seat_name'])
                        ->where('seat_row', $seatData['seat_row'])
                        ->where('seat_column', $seatData['seat_column'])
                        ->where('room_id', $seatData['room_id'])
                        ->first();

                    if ($seat) {
                        // Lưu ghế đã tồn tại vào danh sách lỗi
                        $existingSeats[] = $seat->toArray();
                    } else {
                        // Tạo ghế mới
                        $seatCreate = Seats::create($seatData);

                        if ($seatCreate) {
                            $seatDataList[] = $seatCreate;
                            $seatCreate->reserveForUser();
                        } else {
                            // Nếu không thể tạo ghế, thực hiện rollback và trả về lỗi
                            DB::rollBack();
                            return response()->json(['status' => false, 'message' => 'Failed to create seat.'], 500);
                        }
                    }
                }

                // Nếu có ghế đã tồn tại, thực hiện rollback transaction và trả về danh sách các ghế đã tồn tại
                if (!empty($existingSeats)) {
                    DB::rollBack();
                    return response()->json(['status' => false, 'message' => 'Some seats already exist.', 'data' => $existingSeats], 400);
                }

                // Nếu không có lỗi, commit transaction và tiếp tục xử lý
                DB::commit();

                // Gửi job cho tất cả ghế đã tạo
                if (!empty($seatDataList)) {
                    $this->dispatchResetSeatsJob($seatDataList);
                    // Lưu thông tin ghế vào session
                    Session::put('seats', $seatDataList);
                    Log::info('Seats Session: ' . json_encode(session('seats')));
                }

                return response()->json([
                    'status' => true,
                    'message' => 'Selected seats successfully.',
                    'data' => $seatDataList
                ]);
            } catch (\Exception $e) {
                // Nếu xảy ra lỗi ngoài mong muốn, thực hiện rollback toàn bộ transaction
                DB::rollBack();
                return response()->json(['status' => false, 'message' => 'An error occurred while processing seats.'], 500);
            }
        }

        return response()->json(['status' => false, 'message' => 'Invalid data provided.'], 400);
    }



    public function hasGapIssue($seats)
    {
        usort($seats, function ($a, $b) {
            return strcmp($a['seat_name'], $b['seat_name']); // Sắp xếp theo tên ghế
        });

        // Lưu ghế theo hàng
        $selectedRows = [];
        foreach ($seats as $seat) {
            preg_match('/([A-Za-z]+)(\d+)/', $seat['seat_name'], $match);
            $row = $match[1]; // Hàng
            $column = (int)$match[2]; // Cột

            // Kiểm tra xem hàng đã được chọn chưa
            if (!isset($selectedRows[$row])) {
                $selectedRows[$row] = [];
            }
            // Thêm cột của ghế vào danh sách ghế đã chọn
            $selectedRows[$row][] = $column;
        }

        // Kiểm tra các ghế trong cùng một hàng
        foreach ($selectedRows as $row => $columns) {
            sort($columns); // Sắp xếp lại các cột của ghế trong hàng

            // Kiểm tra nếu có sự bỏ trống giữa các cột trong hàng
            for ($i = 0; $i < count($columns) - 1; $i++) {
                $currentColumn = $columns[$i];
                $nextColumn = $columns[$i + 1];
                // Kiểm tra sự chênh lệch giữa các cột
                if ($nextColumn - $currentColumn == 2) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Please select consecutive seats without gaps.',
                        'data' => [
                            'missing_seat' => $row . ($currentColumn + 1) // Ghế bị bỏ trống giữa các ghế đã chọn
                        ]
                    ], 402);
                }
            }

            $firstColumn = $columns[0];
            $lastColumn = end($columns);
            // var_dump($firstColumn, $lastColumn);
            // die;
            if ($firstColumn == 2) {
                return response()->json([
                    'status' => false,
                    'message' => 'Please select consecutive seats starting from the first seat of the row.',
                    'data' => [
                        'missing_seat' => $row . '1' // Ghế đầu hàng bị bỏ trống
                    ]
                ], 402);
            }
            $maxColumn = $this->getMaxColumnForRow($row); // Giả sử bạn có phương thức này để lấy số ghế tối đa trong một hàng
            if ($maxColumn - $lastColumn == 1) {
                return response()->json([
                    'status' => false,
                    'message' => 'Please select consecutive seats up to the last seat of the row.',
                    'data' => [
                        'missing_seat' => $row . $maxColumn // Ghế cuối hàng bị bỏ trống
                    ]
                ], 402);
            }
        }
    }

    private function getMaxColumnForRow($row)
    {
        // Giả sử bạn có một bảng hoặc cách để lấy số cột tối đa cho một hàng cụ thể
        // Ví dụ: nếu hàng có 10 ghế thì trả về 10
        return 10;  // Giá trị này có thể thay đổi tùy thuộc vào cấu trúc ghế của bạn
    }



    public  function dispatchResetSeatsJob(array $seatIds): void
    {
        // Dispatch một job với toàn bộ các ID ghế đã được tạo
        ResetSeats::dispatch($seatIds)->delay(now()->addMinutes(5));
    }

    public function selectedSeats(Request $request, $roomId)
    {

        $seats = $request->input('seats'); // Ghế người dùng chọn
        // $roomId = $request->input('roomId'); // Lấy roomId từ client (dưới dạng POST)

        if (is_array($seats) && count($seats) > 10) {
            return $this->error('You can only select up to 10 seats.', 400);
        }

        // Broadcast sự kiện ghế đã chọn
        broadcast(new SeatSelected($seats, Auth::id(), $roomId));

        return $this->success($seats, 'Selected seats successfully.');
    }
}
