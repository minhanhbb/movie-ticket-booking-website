<?php

namespace App\Http\Controllers\Api\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\AccountVerificationService;
use Illuminate\Http\JsonResponse;

class AccountVerificationController extends Controller
{
    protected $verificationService;

    /**
     * Create a new controller instance.
     *
     * @param AccountVerificationService $verificationService
     */
    public function __construct(AccountVerificationService $verificationService)
    {
        $this->verificationService = $verificationService;
    }

    /**
     * Xác thực tài khoản người dùng.
     *
     * @param Request $request
     * @param int $userId
     * @return JsonResponse
     */
    public function verify($userId)
    {
        $isVerified = $this->verificationService->verifyAccount($userId);

        if ($isVerified) {
            return redirect()->to('http://localhost:5173/login')->with('success', 'Tài khoản đã được xác minh thành công.');
        }
        return redirect()->to('http://localhost:5173/login')->with('error', 'Tài khoản đã xác minh, vui lượng đăng nhập.');

    }
}
