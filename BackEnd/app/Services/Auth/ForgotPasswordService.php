<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ForgotPasswordService
{
    /**
     * Đặt lại mật khẩu cho người dùng
     *
     * @param string $email
     * @param string $password
     * @return void
     * @throws \Exception
     */
    public function ForgotPassword($email, $password)
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            throw new \Exception('Không tìm thấy người dùng với email này.');
        }
        $user->password = $password;
        $user->save();
    }
}
