<?php

namespace App\Services;

use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserRegistrationService
{
    public function register(array $request)
    {
        // $request['role_id'] = $request['role_id'] ?? 4;
        return User::create($request);
    }
}
