<?php

namespace App\Services\Revenue;

use App\Models\Booking;
use App\Models\Showtime;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;


class RevenueService
{

    private function calculateRevenue(?string $status, ?int $idCinema, ?string $startDate, ?string $endDate)
    {
        $query = Booking::query();

        // Lọc theo trạng thái
        if (!is_null($status)) {
            $query->where('status', $status);
        }

        // Lọc theo cinema_id nếu có
        if (!is_null($idCinema)) {
            $query->whereHas('showtime.room.cinema', function ($subQuery) use ($idCinema) {
                $subQuery->where('id', $idCinema);
            });
        }

        // Lọc theo khoảng thời gian
        if (!is_null($startDate) && !is_null($endDate)) {
            try {
                $start = Carbon::parse($startDate)->startOfDay();
                $end = Carbon::parse($endDate)->endOfDay();
                $query->whereBetween('created_at', [$start, $end]);
            } catch (Exception $e) {
                Log::error('Error parsing dates: ' . $e->getMessage());
                return 0;
            }
        }

        // Tính tổng doanh thu
        return $query->sum('amount');
    }


    public function totalRevenue(string $status)
    {
        return $this->calculateRevenue($status, null, null, null);
    }
    public function allRevenueCinema(string $status)
    {
        return $this->calculateRevenue($status, null, null, null);
    }


    public function totalRevenueByCinema(int $idCinema)
    {
        return $this->calculateRevenue('Thanh toán thành công', $idCinema, null, null);
    }


    public function totalRevenueByCinemaBetweenDates(int $idCinema, string $startDate, string $endDate)
    {
        return $this->calculateRevenue('Thanh toán thành công', $idCinema, $startDate, $endDate);
    }


    public function totalRevenueBetweenDates(string $startDate, string $endDate)
    {
        return $this->calculateRevenue('Thanh toán thành công', null, $startDate, $endDate);
    }
}
