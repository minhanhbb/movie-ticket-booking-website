<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class Localization
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->header('Accept-Language');

        // Nếu có ngôn ngữ hợp lệ (tiếng Anh hoặc tiếng Việt), set ngôn ngữ đó
        if ($locale && in_array($locale, ['en', 'vi'])) {
            App::setLocale($locale);
        } else {
            // Nếu không, dùng ngôn ngữ mặc định là tiếng Việt
            App::setLocale(config('app.locale'));
        }
        return $next($request);
    }
}
