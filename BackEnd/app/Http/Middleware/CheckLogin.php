<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CheckLogin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!Auth::check()) {
            // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
            // return redirect()->route('register.form');
        }

        // Nếu đã đăng nhập, tiếp tục xử lý request
        return $next($request);
    }
}
