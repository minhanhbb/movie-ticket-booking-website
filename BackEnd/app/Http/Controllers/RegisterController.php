<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerifyAccount;
use App\Services\UserRegistrationService;
use Termwind\Components\Dd;

class RegisterController extends Controller
{
    protected $userRegistrationService;

    public function __construct(UserRegistrationService $userRegistrationService)
    {
        $this->userRegistrationService = $userRegistrationService;
    }

    public function register(RegisterRequest $request)
    {
        try {
            // dd($request);
            $user = $this->userRegistrationService->register($request->validated());
            Mail::to($user->email)->queue(new VerifyAccount($user));

            return redirect()->route('register.form')->with('success', 'Tạo tài khoản thành công!');
        } catch (\Throwable $th) {

            return redirect()->route('register.form')->withErrors(['error' => 'Có lỗi xảy ra. Vui lòng thử lại.']);
        }
    }
}

