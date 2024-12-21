<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SeatSelected implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $seats;
    public $userId;
    public $roomId;

    public function __construct(array $seats, $userId, $roomId)
    {
        $this->seats = $seats;
        $this->userId = $userId;
        $this->roomId = $roomId;
        Log::info("User {$this->userId} selects seats in room {$this->roomId}");
    }

    public function broadcastOn()
    {
        // Đảm bảo rằng bạn broadcast đúng kênh theo roomId
        Log::info("broadcastOn");
        Log::info("'seats-'.$this->roomId");
        return new PrivateChannel('seats-'.$this->roomId);
    }

    public function broadcastWith(): array
    {
        Log::info("broadcastWith");
        return [
            'seats' => $this->seats,
            'userId' => $this->userId,
            'roomId' => $this->roomId
        ];
    }
}
