<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Password\ForgotPasswordRequest;
use App\Http\Requests\Password\SendOtpRequest;
use App\Http\Requests\Password\VerifyOtpRequest;
use App\Models\User;
use App\Services\Auth\ForgotPasswordService;
use App\Services\Auth\OtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class ForgotPasswordController extends Controller
{
    protected $otpService;
    protected $forgotpasswordService;

    public function __construct(OtpService $otpService, ForgotPasswordService $forgotpasswordService)
    {
        $this->otpService = $otpService;
        $this->forgotpasswordService = $forgotpasswordService;
    }

    public function sendOtp(SendOtpRequest $request)
    {
        $request->validated();
        try {
            $email = $request->input('email');
            $message = $this->otpService->sendOtp($email);
            return $this->success(['message' => $message, 'email' => $email], 'success', 200);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage(), 400);
        }
    }

    public function verifyOtp(VerifyOtpRequest $request)
    {
        $request->validated();
        try {
            $otp = $request->input('otp');
            $email = $request->input('email'); // Nhận email từ yêu cầu
            $message = $this->otpService->verifyOtp($otp, $email);
            return $this->success($message, 'success', 200);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage(), 400);
        }
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $request->validated();
        try {
            // Kiểm tra xem OTP đã được xác thực chưa
            $email = $request->input('email'); // Nhận email từ yêu cầu
            if (!$this->otpService->canResetPassword($email)) {
                return $this->error('OTP chưa được xác thực.', 400);
            }

            // Gọi service để đặt lại mật khẩu
            $this->forgotpasswordService->ForgotPassword($email, $request->password);
            // Xóa trạng thái xác thực OTP
            $this->otpService->clearOtpVerification($email);

            return $this->success('Mật khẩu đã được đặt lại thành công!', 'success', 200);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage(), 400);
        }
    }
}
