<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('seats-{roomId}', function ($user, $roomId) {
    return Auth::check();
});


Broadcast::channel('seats{userId}', function ( $user, $userId) {
    return (int) $user->id === (int) $userId; // Hoặc điều kiện xác thực nếu cần thiết
});

