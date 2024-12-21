<?php

namespace App\Http\Controllers\Api\Google;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Response;
use App\Models\User;
use App\Services\Auth\LoginService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;

class GoogleController extends Controller
{
    protected $loginService;

    public function __construct(LoginService $loginService)
    {
        $this->loginService = $loginService;
    }

    public function getGoogleSignInUrl()
    {
        try {
            $url = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
            return response()->json(['url' => $url], Response::HTTP_OK);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => 'failed',
                'message' => $exception->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Google Login Callback
    public function loginCallback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Check if the user already exists in the database
            $user = User::where('email', $googleUser->email)->first();

            if ($user) {
                $credentials = [
                    'email' => $user->email,
                    'password' => 'password',
                ];

                $token = $this->loginService->login($credentials);
                $profile = $this->loginService->index();
                return $this->success(['token' => $token, 'profile' => $profile], 200);
                // return Redirect::to('http://localhost:5173')->with('success', [
                //     'message' => __('Google login successful'),
                //     'token' => $token,
                //     'profile' => $profile
                // ]);

                // return response()->json([
                // 'message' => __('Google login successful'),
                // 'token' => $token,
                // 'profile' => $profile
                // ], Response::HTTP_OK);

            } else {
                $newUser = User::create([
                    'email' => $googleUser->email,
                    'name' => $googleUser->name,
                    'google_id' => $googleUser->id,
                    'password' => 'password',
                    'email_verified_at' => now(),
                ]);

                $credentials = [
                    'email' => $newUser->email,
                    'password' => 'password',
                ];

                $token = $this->loginService->login($credentials);
                return $this->success(['token' => $token, 'profile' => $newUser], 200);
                // return Redirect::to('http://localhost:5173')->with('success', [
                //     'message' => __('Google login successful'),
                //     'token' => $token,
                //     'profile' => $newUser
                // ]);
                // return response()->json([
                //     'message' => __('Google sign in successful'),
                //     'token' => $token,
                //     'profile' => $newUser
                // ], Response::HTTP_CREATED);
            }

        } catch (\Exception $exception) {
            return response()->json([
                'message' => __('Đăng nhập google thất bại'),
                'error' => $exception->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

}
