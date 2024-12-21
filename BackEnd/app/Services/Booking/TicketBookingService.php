<?php

namespace App\Services\Booking;

use App\Http\Requests\Booking\TicketBookingRequest;
use App\Models\Booking;
use App\Models\Cinema;
use App\Models\Combo;
use App\Models\Seats;
use App\Services\Booking\Steps\SelectMovie;
use App\Services\Booking\Steps\SelectSeats;
use App\Services\Booking\Steps\SelectCombos;
use App\Services\Booking\Steps\ProcessPayment;
use App\Traits\UploadImageTrait;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Picqer\Barcode\BarcodeGenerator;
use Picqer\Barcode\BarcodeGeneratorPNG;

class TicketBookingService
{
    use UploadImageTrait;
    protected SelectMovie $selectMovieStep;
    protected SelectSeats $selectSeatsStep;
    protected SelectCombos $selectCombosStep;
    protected ProcessPayment $processPaymentStep;

    public function __construct()
    {
        $this->selectMovieStep = new SelectMovie();
        $this->selectSeatsStep = new SelectSeats();
        $this->selectCombosStep = new SelectCombos();
        $this->processPaymentStep = new ProcessPayment();
        $this->selectMovieStep->setNext($this->selectSeatsStep)
            ->setNext($this->selectCombosStep);
    }
    public function bookingTicket(Request $req)
    {
        $result = $this->selectMovieStep->handle($req);
        if ($result instanceof JsonResponse) {
            return $result;
        }
        // $booking = $this->bookTicket($req);
        return $result;
    }

    public function ticketBooking() {}
    public function bookTicket(Request $request)
    {
        Log::info('Booking request: ' . json_encode($request->all()));
        $bookTicket = $this->bookings($request);
        if ($bookTicket) {
            $seats = Cache::get('seats');
            $seatData = [];
            foreach ($seats as $seat) {
                $seat = Seats::where('seat_name', $seat['seat_name'])
                    ->where('seat_row', $seat['seat_row'])
                    ->where('seat_column', $seat['seat_column'])
                    ->where('room_id', $seat['room_id'])
                    ->first();
                $seatData[] = $seat;
            }
            Session::put('seats', $seatData);
            $this->bookTicketSaveSession($request, $bookTicket);
        }
       return $bookTicket;
    }


    public function bookTicketSaveSession(Request $request, $booking)
    {
        $combos = Cache::get('combos');
        Log::info('danh sach combos duoc luu tru tam thoi bang Cache:'.json_encode($combos));
        // Kiểm tra xem session có chứa combos không
        if (!empty($combos))  {
            foreach ($combos as $combo) {
                // Liên kết combo với booking
                $booking->combos()->attach($combo->id, ['quantity' => $combo->quantity ?? 1]);

                // Trừ số lượng combo trong kho
                $comboModel = Combo::find($combo->id); // Lấy đối tượng combo từ cơ sở dữ liệu
                if ($comboModel) {
                    $comboModel->volume -= $combo->quantity ?? 1; // Trừ số lượng
                    $comboModel->save(); // Lưu lại thay đổi
                } else {
                    Log::error("Combo with ID {$combo->id} not found in the database.");
                }
            }
        } else {
            Log::warning('No combos found in session.');
        }

        // Kiểm tra xem session có chứa seats không
        $selectedSeats =  Cache::get('seats');
        Log::info('ghe da chon va duoc luu tru tai Cache:' . json_encode($selectedSeats));
        if (!empty($selectedSeats)) {
            $booking->seats()->sync(collect(session('seats'))->pluck('id'));
            $seatIds = collect(session('seats'))->pluck('id')->toArray();
            Seats::updateSeatsStatus($seatIds, 'booked');
        } else {
            Log::warning('No seats found in session.');
        }
    }



    public function bookings(Request $request)
    {
        $booking_code = $this->generateBookingCode($request);
        // Lưu đường dẫn của ảnh mã vạch vào cơ sở dữ liệu (URL từ ImgBB)
        $booking = Booking::create($request->all() + ['user_id' => request('user_id')] + ['booking_code' => $booking_code]);
        $qrcode = $this->generateQrCode($booking);
        $generator = new BarcodeGeneratorPNG();
        $barcode = $generator->getBarcode($booking->id, BarcodeGenerator::TYPE_CODE_128);
        // Tạo tên file duy nhất cho mã vạch (dựa vào booking ID)
        $fileName = 'barcode_' . $booking_code . '.png';
        // Lưu mã vạch vào thư mục 'public/barcodes'
        Storage::put('public/barcodes/' . $fileName, $barcode);

        // Đưa đường dẫn đến mã vạch vào phương thức uploadImage
        $filePath = storage_path('app/public/barcodes/' . $fileName);
        $imageUrl = $this->uploadImage($filePath); // Gửi ảnh lên ImgBB
        $booking->barcode = $imageUrl;
        $booking->qrcode = $qrcode;
        $booking->save();
        return $booking;
    }

    public function processPayment(Request $request)
    {

        if ($request->pay_method_id == 1) {
            $urlPayment = $this->processPaymentStep->vnpay($request);  // Gọi phương thức VNPAY
            return response()->json(['url' => $urlPayment]);
        } elseif ($request->pay_method_id == 2) {
            $urlPayment = $this->processPaymentStep->momoPayment($request);  // Gọi phương thức MOMO
            return response()->json(['url' => $urlPayment]);
        } else {
            // Xóa booking nếu phương thức thanh toán không hợp lệ
            Booking::where('id', session('booking'))->delete();
            return response()->json(['message' => 'Phương thức thanh toán chưa hoàn thiện. Vui lòng chọn lại!'], 400);
        }
    }


    public function generateBookingCode(Request $request)
    {
        $cenima = Cinema::findOrFail($request->cinemaId);
        $sortName = strtoupper(substr($cenima->cinema_name, 0, 3));
        $currentDate = now()->format('Ymd');
        $bookingCount = Booking::whereDate('created_at', now()->toDateString())->count() + 1;
        $bookingNumber = str_pad($bookingCount, 3, '0', STR_PAD_LEFT);
        // $bookingCode = '#' . $sortName . $currentDate . '-' . $bookingNumber;
        $bookingCode = $currentDate .  $bookingNumber;
        return $bookingCode;
    }

    public function generateQrCode($booking)
    {
        $url = 'http://localhost:5173/admin/ordersdetail/' . $booking->id;
        // Tạo mã QR với URL đó dưới dạng PNG
        $qrcode = QrCode::format('png')->generate($url);
        // Đặt tên file và lưu vào thư mục public
        $fileName = 'order_' . $booking->id . '.png';
        Storage::disk('public')->put('qrcodes/' . $fileName, $qrcode);  // Lưu vào storage/app/public
        $filePath = storage_path('app/public/qrcodes/' . $fileName);
        $imageUrl = $this->uploadImage($filePath); // Gửi ảnh lên ImgBB
        return $imageUrl;
    }
}
