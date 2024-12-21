<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginService
{

    public function index()
    {
        $user = Auth::user();
        $userWithRoles = User::with('roles', 'rank')->findOrFail($user->id);
        return $userWithRoles;
    }
    public function get(int $id): User
    {
        $user = User::findOrFail($id);
        return $user;
    }
    public function allUser()
    {
        return User::orderByDesc('created_at')->paginate(10);
    }

    public function update(int $id, array $data): User
    {
        $user = User::findOrFail($id);
        $user->update($data);
        return $user;
    }
    public function login(array $credentials)
    {
        if (!Auth::attempt($credentials)) {
            throw new \Exception('không có quyền truy cập', 401);
        }

        $user = Auth::user();

        if (!$user) {
            throw new \Exception('Người dùng chưa được xác thực', 401);
        }
        if (!($user instanceof User)) {
            throw new \Exception('Người dùng đã xác thực không phải là một trường hợp của Người dùng', 500);
        }

        return $user->createToken('authToken')->plainTextToken;
    }
}
