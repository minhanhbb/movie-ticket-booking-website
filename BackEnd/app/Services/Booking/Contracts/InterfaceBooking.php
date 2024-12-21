<?php

namespace App\Services\Booking\Contracts;

use Illuminate\Http\Request;

use Illuminate\Http\JsonResponse;
interface InterfaceBooking
{
    public function setNext(InterfaceBooking $handle): InterfaceBooking;

    // Xử lý bước hiện tại
    public function handle(Request $request): ?JsonResponse;
}
