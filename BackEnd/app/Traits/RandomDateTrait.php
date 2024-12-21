<?php

namespace App\Traits;

trait RandomDateTrait
{
    /**
     * Tạo ngày giờ ngẫu nhiên giữa hai khoảng thời gian.
     *
     * @param string $startDate Ngày bắt đầu (Y-m-d).
     * @param string $endDate Ngày kết thúc (Y-m-d).
     * @return string Ngày giờ ngẫu nhiên (Y-m-d H:i:s).
     */
    public function randomDate($startDate, $endDate)
    {
        $startTimestamp = strtotime($startDate);
        $endTimestamp = strtotime($endDate);

        // Tạo một timestamp ngẫu nhiên giữa hai khoảng
        $randomTimestamp = mt_rand($startTimestamp, $endTimestamp);

        // Trả về định dạng ngày
        return date('Y-m-d H:i:s', $randomTimestamp);
    }
}
