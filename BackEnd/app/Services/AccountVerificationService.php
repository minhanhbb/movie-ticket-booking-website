<?php

namespace App\Services;

use App\Models\User;

class AccountVerificationService
{
    public function verifyAccount(int $userId)
    {
        $user = User::find($userId);

        if ($user) {
            $user->email_verified_at = now();
            $user->save();
            return true;
        }

        return false;
    }
}
