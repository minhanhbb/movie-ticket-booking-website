<?php

namespace App\Http\Controllers\Api\Revenue;

use App\Http\Controllers\Controller;
use App\Services\Revenue\RevenueService;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RevenueController extends Controller
{
    protected $revenueService;

    public function __construct(RevenueService $revenueService)
    {
        $this->revenueService = $revenueService;
    }
    public function totalRevenue($status)
    {
        $totalRevenue = $this->revenueService->totalRevenue($status);
         return $this->success($totalRevenue);
    }
    public function totalRevenueByCinema($cinema_id)
    {
        $totalRevenue = $this->revenueService->totalRevenueByCinema($cinema_id);
         return $this->success($totalRevenue);
    }
    public function totalRevenueByCinemaBetweenDates($cinema_id, $startDate, $endDate)
    {
        $totalRevenue = $this->revenueService->totalRevenueByCinemaBetweenDates($cinema_id, $startDate, $endDate);
         return $this->success($totalRevenue);
    }
    public function totalRevenueBetweenDates($startDate, $endDate)
    {
        $totalRevenue = $this->revenueService->totalRevenueBetweenDates($startDate, $endDate);
        return $this->success($totalRevenue);
    }
    public function allRevenueCinema()
    {
        $totalRevenue = $this->revenueService->allRevenueCinema('Thanh toán thành công');
        return $this->success($totalRevenue);
    }
}
