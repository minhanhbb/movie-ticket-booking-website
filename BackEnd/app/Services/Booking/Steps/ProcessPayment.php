<?php

namespace App\Services\Booking\Steps;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ProcessPayment
{

    public function vnpay(Request $request): ?string
    {
        error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
        date_default_timezone_set('Asia/Ho_Chi_Minh');

        // URL trang thanh toán VNPAY
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost:8000/api/vnpay-return"; // URL trả về sau thanh toán
        Log::info('VNPAY Return URL: ' . $vnp_Returnurl);

        // Mã và chuỗi bí mật của VNPAY
        $vnp_TmnCode = "AB5KXHTL"; // Mã website tại VNPAY
        $vnp_HashSecret = "UPJTP6WYL5P1DRCDK7M003GD8MNNP0SI"; // Chuỗi bí mật

        // Lấy dữ liệu từ request
        // $bookingId = session('booking'); // Booking ID từ bước trước
        // Log::info('Booking ID: ' . $bookingId);
        // if (!$bookingId) {
        //     return null; // Trả về null nếu không có Booking ID
        // }
        // Tạo các thông tin cần thiết cho giao dịch
        $vnp_TxnRef = uniqid(); // Mã tham chiếu giao dịch
        // $amount = $request->input('amount');
        // $showtime_id = $request->input('showtime_id');
        // $pay_method_id = $request->input('pay_method_id');
        $vnp_OrderInfo = "Thanh toan VNPAY cho don hang " . $vnp_TxnRef;
        $vnp_OrderType = 'Moveek';
        $vnp_Amount = $request->input('amount') * 100; // Số tiền thanh toán (đơn vị VND)
        $vnp_Locale = "VN"; // Ngôn ngữ hiển thị
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR']; // Địa chỉ IP của người dùng

        // Cập nhật thời gian hết hạn giao dịch
        $vnp_ExpireDate = date('YmdHis', strtotime('+15 minutes')); // Định dạng yyyyMMddHHmmss

        // Dữ liệu gửi lên VNPAY
        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
            // 'showtime_id' => $showtime_id,
            // 'amount' => $amount,
            // 'pay_method_id' => $pay_method_id
        );

        // Thêm mã ngân hàng và mã hóa đơn nếu có
        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }
        if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
            $inputData['vnp_Bill_State'] = $vnp_Bill_State;
        }

        // Sắp xếp dữ liệu theo thứ tự chữ cái
        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        // Tạo chuỗi mã bảo mật
        $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
        $vnp_Url = $vnp_Url . "?" . $query . 'vnp_SecureHash=' . $vnpSecureHash;

        // Trả về URL thanh toán
        return $vnp_Url;
    }


    public  function execPostRequest($url, $data)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER,
            array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data)
            )
        );
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        //execute post
        $result = curl_exec($ch);
        //close connection
        curl_close($ch);
        return $result;
    }


    public function momoPayment(Request $request)
    {
        $bookingId = session('booking'); // Booking ID từ bước trước
        Log::info('Booking ID: ' . $bookingId);
        if (!$bookingId) {
            return null; // Trả về null nếu không có Booking ID
        }
        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

        $partnerCode = 'MOMOBKUN20180529';
        $accessKey = 'klm05TvNBzhg7h7j';
        $secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
        $orderInfo = "Thanh toán qua MoMo";
        $amount = $request->input('amount');
        $orderId = $bookingId;
        $showtimeId = $request->input('showtimeId');
        $redirectUrl = "http://localhost:8000/";
        $ipnUrl = "http://localhost:8000/";
        $extraData = "";

        // if (isset($_POST['momo'])) { // Sử dụng 'momo' để kiểm tra
        $requestId = time() . "";
        $requestType = "payWithATM";

        // Trước khi ký HMAC SHA256 signature
        $rawHash = "accessKey=" . $accessKey . "&amount=" . $amount . "&extraData=" . $extraData . "&ipnUrl=" . $ipnUrl . "&orderId=" . $orderId . "&orderInfo=" . $orderInfo . "&partnerCode=" . $partnerCode . "&redirectUrl=" . $redirectUrl . "&requestId=" . $requestId . "&requestType=" . $requestType;
        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        $data = array(
            'partnerCode' => $partnerCode,
            'partnerName' => "Test",
            "storeId" => "MomoTestStore",
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'showtimeId' => $showtimeId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'lang' => 'vi',
            'extraData' => $extraData,
            'requestType' => $requestType,
            'signature' => $signature
        );

        $result = $this->execPostRequest($endpoint, json_encode($data));
        $jsonResult = json_decode($result, true); // Giải mã json
        // Kiểm tra và chuyển hướng đến payUrl
        // if (isset($jsonResult['payUrl'])) {
        //     header('Location: ' . $jsonResult['payUrl']);
        //     exit(); // Dừng ngay sau khi thực hiện chuyển hướng
        // } else {
        //     // Xử lý lỗi nếu không có payUrl
        //     echo "Lỗi: Không nhận được payUrl từ MoMo.";
        //     exit();
        // }
        Log::info($jsonResult);
        Log::info($jsonResult);

        // Kiểm tra xem phản hồi có chứa 'payUrl' hay không
        if (isset($jsonResult['payUrl'])) {
            return response()->json(['payUrl' => $jsonResult['payUrl']]);
        } else {
            return response()->json(['error' => 'Không nhận được payUrl từ MoMo'], 500);
        }
        // }
    }
}
