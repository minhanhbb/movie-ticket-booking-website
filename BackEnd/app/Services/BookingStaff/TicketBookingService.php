<?php

namespace App\Services\BookingStaff;

use App\Http\Requests\Booking\TicketBookingRequest;
use App\Models\Booking;
use App\Models\Cinema;
use App\Models\Combo;
use App\Models\Seats;
use App\Services\BookingStaff\Steps\SelectMovie;
use App\Services\BookingStaff\Steps\SelectSeats;
use App\Services\BookingStaff\Steps\SelectCombos;
use App\Services\BookingStaff\Steps\SelectUser;
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
    protected SelectUser $selectUserStep;

    public function __construct()
    {
        $this->selectMovieStep = new SelectMovie();
        $this->selectSeatsStep = new SelectSeats();
        $this->selectCombosStep = new SelectCombos();
        $this->selectUserStep = new SelectUser();

        $this->selectMovieStep->setNext($this->selectSeatsStep)
            ->setNext($this->selectCombosStep)
            ->setNext($this->selectUserStep);
    }
    public function bookingTicket(Request $req)
    {
        $result = $this->selectMovieStep->handle($req);
        if ($result instanceof JsonResponse) {
            return $result;
        }
        $booking = $this->bookTicket($req);
        return $result;
    }
    // public function selectMovieSeats(Request $request)
    // {
    //     $result = $this->selectMovieStep->handle($request);
    //     if ($result instanceof JsonResponse) {
    //         return $result;
    //     }
    //     //Xử lý đặt ghế
    //     $result = $this->selectSeatsStep->handle($request);
    //     session()->put('seatss', $result);
    //     Log::info('Seats result: ' . json_encode($result));
    //     if ($result instanceof JsonResponse) {
    //         return $result;
    //     }
    //     return null;
    // }


    // public function selectCombos(Request $request)
    // {
    //     $result = $this->selectCombosStep->handle($request);
    //     if ($result instanceof JsonResponse) {
    //         return $result;
    //     }
    //     return null;
    // }
    public function ticketBooking() {}
    public function bookTicket(Request $request)
    {
        Log::info('Booking request: ' . json_encode($request->all()));
        $bookTicket = $this->bookings($request);
        Cache::put('booking', $bookTicket->id);
        Log::info('Booking retủn: ' .        $bookTicket);
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
        // Kiểm tra xem session có chứa combos không
        if (session()->has('combos') && session('combos')) {
            foreach (session('combos') as $combo) {
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

        if (Cache::has('userbooking') && Cache::get('userbooking')) {
            $userBooking = Cache::get('userbooking');
            
            if ($userBooking && isset($userBooking->id)) {
                $booking->user_id = $userBooking->id;
                $booking->save();
                Log::info('User ID: ' . $userBooking->id);
                $booking->booking_users()->attach($userBooking->id);
            }
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
        $booking_payment = '5';
        $booking = Booking::create($request->validated() + ['user_id' => Auth::user()->id] + ['booking_code' => $booking_code] + ['pay_method_id' => $booking_payment]);
        $qrcode = $this->generateQrCode($booking);
        $booking->qrcode = $qrcode;
        $booking->save();
        return $booking;
    }

    public function bookingmapdata($id){
        $booking = Booking::where('id', $id)->get();
        $mappedResult = $booking->map(function ($item) {
            return [
                'booking_id' => $item->id,
                'user_name' => $item->user->user_name,
                'email' => $item->user->email,
                'booking_code' => $item->booking_code,
                'barcode' => $item->barcode,
                'qrcode' => $item->qrcode,
                'payMethod' => $item->payMethod->pay_method_name,
                'amount' => $item->amount,
                'movie_name' => $item->showtime->movie->movie_name,
                // 'status' => $item->status,
                'showtime_date' => $item->showtime->showtime_date,
                'room_name' => $item->showtime->room->room_name,
                'cinema_name' => $item->showtime->room->cinema->cinema_name,
                'created_at' => $item->created_at,
                'seats' => $item->seats,
                'combos' => $item->combos
            ];
        });
        return $mappedResult;
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
