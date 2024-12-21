<?php

namespace App\Http\Controllers\Api\Filter\DashBoard;

use App\Http\Controllers\Controller;
use App\Services\Filter\DashBoard\FilterOfDashBoarchService;
use Illuminate\Http\Request;

class FilterOfDashBoarchController extends Controller
{
    protected $filterOfDashBoarchService;

    public function __construct(FilterOfDashBoarchService $filterOfDashBoarchService)
    {
        $this->filterOfDashBoarchService = $filterOfDashBoarchService;
    }

    public function filterOfDashBoarch(Request $request)
    {
        $status = $request->query('status');
        $cinema_id = $request->query('cinema_id');
        $start_date = $request->query('start_date');
        $end_date = $request->query('end_date');
        $month = $request->query('month');
        $year = $request->query('year');
        $day = $request->query('day');

        $filterRevenue = $this->filterOfDashBoarchService->filterofbooking(
            $status, $cinema_id, $start_date, $end_date, $month, $year, $day
        );
        $total = $this->filterOfDashBoarchService->totaldashboard($filterRevenue);

        return response()->json(['status' => true, 'message' => 'Success','chart' => $total,'data'=> $filterRevenue ], 200);
    }
}
