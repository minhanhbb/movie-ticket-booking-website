<?php

namespace App\Http\Controllers\Api\Auth;

use App\Mail\VerifyAccount;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\Store\StoreUserRequest;
use App\Http\Requests\Update\UpdateUserRequest;
use App\Models\Booking;
use App\Models\Rank;
use App\Models\User;
use App\Services\Auth\LoginService;
use App\Services\UserRegistrationService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
class AuthController extends Controller
{
    protected $userRegistrationService;
    protected $loginService;

    public function __construct(UserRegistrationService $userRegistrationService, LoginService $loginService,)
    {
        $this->userRegistrationService = $userRegistrationService;
        $this->loginService = $loginService;
    }

    public function index()
    {
        $user = $this->loginService->index();
        return $this->success($user);
    }

    public function show($id)
    {
        try {
            $user = $this->loginService->get($id)->load(['favoriteMovies', 'rank', 'pointHistories','favorites']); // Tải rank ở đây

            if (!$user) {
                return response()->json(['error' => 'Không Tồn tại Tài Khoản'], 404);
            }

            $totalAmount = Booking::where('user_id', $user->id)->sum('amount');
            $rankName = $user->rank ? $user->rank->name : 'Không có rank';

            $user->total_amount = $totalAmount;
            $user->rank_name = $rankName;
            // unset($user->rank);

            return response()->json(['success' => true, 'user' => $user], 200);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function list()
    {
        $data = User::with('favoriteMovies')->get();
        return $this->success($data);
    }

    public function allUser()
    {
        $user = $this->loginService->allUser();
        return $user;
    }

    public function update(UpdateUserRequest $request, $id)
    {
        try {
            $filesToUpload = ['avatar', 'cover'];
            $userData = $request->validated();

            foreach ($filesToUpload as $fileKey) {
                if ($request->hasFile($fileKey)) {
                    $userData[$fileKey] = $this->uploadImage($request->file($fileKey));
                }
            }

            // Update the user using the login service
            $user = $this->loginService->update($id, $userData);

            // Success response
            return $this->success($user);
        } catch (ModelNotFoundException $e) {
            return $this->error($e->getMessage());
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function register(RegisterRequest $request)
    {
        try {
            $user = $this->userRegistrationService->register($request->validated());
            Mail::to($user->email)->queue(new VerifyAccount($user));
            return $this->success(__('messages.success_register'), 'success', 200);
        } catch (\Throwable $th) {
            return $this->error($th->getMessage(), 400);
        }
    }


    public function login(UpdateUserRequest $request)
    {
        try {
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return $this->error('Tài khoản không tồn tại.', 404);
            }
            if ($user->email_verified_at === null) {
                return $this->error('Tài khoản chưa được kích hoạt, vui lòng kiểm tra email để kích hoạt.', 403);
            }
            if ($user->status === 0) {
                return $this->error('Tài khoản đã bị khóa vui lòng liên hệ admin để được hỗ trợ', 403);
            }
            if (!password_verify($request->password, $user->password)) {
                return $this->error('Mật khẩu không chính xác.', 401);
            }
            $token = $this->loginService->login($request->validated());
            // return response()->json(['token' => $token], 200);
            // return $this->success($token, 200);
            $user = $this->loginService->index();
            return $this->success(['token' => $token, 'profile' => $user], 200);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = $request->user();
            if ($user) {
                $user->tokens()->delete();
                return $this->success([], 'Đăng Xuất Thành công.');
            } else {
                return $this->error('Người dùng không được xác thực hoặc thiếu mã thông báo.');
            }
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}
