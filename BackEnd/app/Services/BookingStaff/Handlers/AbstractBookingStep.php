<?php

namespace App\Services\BookingStaff\Handlers;

use Illuminate\Http\JsonResponse;

use App\Services\Booking\Contracts\InterfaceBooking;
use Illuminate\Http\Request;

abstract class AbstractBookingStep implements InterfaceBooking
{
    protected ?InterfaceBooking $next = null;

    public function setNext(InterfaceBooking $handle): InterfaceBooking
    {
        $this->next = $handle;
        return $handle;
    }

    public function handle(Request $request): ?JsonResponse
    {
        $result = $this->process($request);

        // Nếu có lỗi, trả về ngay lập tức
        //        if (isset($result->errors) && !empty($result->errors)) {
        //            return $result;
        //        }
        // Nếu có lỗi (kết quả từ process là một JsonResponse), trả về ngay lập tức
        if ($result instanceof JsonResponse) {
            return $result;
        }

        // Nếu không có lỗi, tiếp tục gọi bước tiếp theo nếu có
        $nextResult = $this->next ? $this->next->handle($request) : null;

        // Nếu không có bước tiếp theo, trả về kết quả hiện tại (hoặc khi không có bước tiếp theo)
        return $nextResult ?? null;
    }

    // Gọi hàm handle của bước tiếp theo

    /**
     * Phương thức cụ thể của từng bước xử lý
     * @param Request $request
     * @return ?array
     */
    abstract protected function process(Request $request): ?JsonResponse;
}
