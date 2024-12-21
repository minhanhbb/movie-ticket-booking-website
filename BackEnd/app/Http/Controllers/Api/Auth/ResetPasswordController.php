<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Password\ResetPasswordRequest;
use App\Services\Auth\PasswordResetService;
use Illuminate\Http\Request;

class ResetPasswordController extends Controller
{
    protected $resetPasswordService;

    public function __construct(PasswordResetService $resetPasswordService){
        $this->resetPasswordService = $resetPasswordService;
    }
    public function resetPassword(ResetPasswordRequest $request){
        try {
            $user = $this->resetPasswordService->resetPassword($request->validated());
            return response()->json(['message' => 'Đổi mật khẩu thành công', 'user' => $user], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
