<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ConfigController extends Controller
{
    public function envConfig()
    {
        return response()->json([
            'PUSHER_APP_KEY' => env('PUSHER_APP_KEY'),
            'PUSHER_APP_CLUSTER' => env('PUSHER_APP_CLUSTER'),
            'PUSHER_SCHEME' => env('PUSHER_SCHEME'),
            'PUSHER_HOST' => env('PUSHER_HOST'),
            'PUSHER_PORT' => env('PUSHER_PORT'),
        ]);
    }
}
