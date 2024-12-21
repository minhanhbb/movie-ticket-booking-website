<?php

namespace App\Events;

use App\Models\Seats;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SeatReset implements ShouldBroadcast
{
    public $validSeatIds;
    public $userId;
    public function __construct(array $validSeatIds, $userId)
    {
        // Truyền mảng seat IDs
        $this->userId = $userId ?? 'guest';
        $this->validSeatIds = $validSeatIds;
        Log::info('Broadcasting seat reset event for seats with IDs: ' . implode(', ', $validSeatIds), ['user_id' => $this->userId]);
    }

    public function broadcastOn()
    {
        Log::info('Broadcasting seat reset event for user ID: ' . $this->userId);
        // Kênh broadcast
        return new PrivateChannel('seats' . $this->userId);
    }

    public function broadcastWith(): array
    {
        Log::info('Broadcasting seat reset event for user ID: ' . $this->userId);
        // Trả về mảng seatIds và thông báo, chỉ một lần
        // Kênh được format là 'seats-{userId}' e.g. 'seats-1'
        return [
            'userId' => $this->userId,
            'seats' => $this->validSeatIds,  // Trả về mảng các seat ID
            'message' => 'Hết thời gian giữ ghế. Hãy thực hiện lại đơn hàng của bạn trong 5 phút.',
        ];
    }
}