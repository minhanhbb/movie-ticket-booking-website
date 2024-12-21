<?php

namespace App\Services\Auth;

use App\Mail\ResetPasswordOtpMail;
use Illuminate\Support\Facades\Cache;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;

class OtpService
{
    protected $otpExpiration = 300;
    public function sendOtp($email)
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            throw new \Exception('Không tìm thấy người dùng với email này.');
        }

        $otp = rand(100000, 999999); // Tạo OTP ngẫu nhiên 6 số

        Cache::put('otp_' . $email, $otp, $this->otpExpiration); // Lưu OTP vào cache
        Log::info('Mã OTP đã lưu trong cache cho email ' . $email . ': ' . $otp);

        Mail::to($user->email)->queue(new ResetPasswordOtpMail($otp));

        return 'Mã OTP đã được gửi đến email của bạn.';
    }

    public function verifyOtp($otp, $email)
    {
        $cachedOtp = Cache::get('otp_' . $email);

        if (!$cachedOtp) {
            throw new \Exception('OTP đã hết hạn hoặc không hợp lệ.');
        }

        if ($cachedOtp != $otp) {
            throw new \Exception('Mã OTP không đúng.');
        }

        Cache::forget('otp_' . $email);
        Cache::put('otp_verified_' . $email, true, $this->otpExpiration);

        return 'OTP đã xác thực thành công.';
    }

    public function canResetPassword($email)
    {
        return Cache::has('otp_verified_' . $email);
    }

    public function clearOtpVerification($email)
    {
        Cache::forget('otp_verified_' . $email);
    }
}
