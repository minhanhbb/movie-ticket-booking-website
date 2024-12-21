<?php

namespace App\Http\Controllers\Api\Revenue;

use App\Http\Controllers\Controller;
use App\Services\Revenue\DashboardAdminService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class DashboardAdminController extends Controller
{
    protected $dashboardAdminService;

    public function __construct(DashboardAdminService $dashboardAdminService)
    {
        $this->dashboardAdminService = $dashboardAdminService;
    }

    public function dashboardAdmin(Request $request)
    {
        $status = $request->query('status');
        $cinema_id = $request->query('cinema_id');
        $start_date = $request->query('start_date');
        $end_date = $request->query('end_date');
        $month = $request->query('month');
        $year = $request->query('year');
        $day = $request->query('day');

        // Gọi hàm lọc từ service
        $filterRevenue = $this->dashboardAdminService->filterofbooking(
            $status,
            $cinema_id,
            $start_date,
            $end_date,
            $month,
            $year,
            $day
        );
        // Tính tổng doanh thu và số lượng booking
        $total = $this->dashboardAdminService->totaldashboard($filterRevenue['filtered_data']);

        // Doanh thu theo phim

        return response()->json([
            'status' => true,
            'message' => 'Success',
            'chart' => $total,
            'data' => $filterRevenue['filtered_data'],
            'movie' => $filterRevenue['data_movie']
        ], 200);
    }

    public function dashboard(Request $request)
    {
        $status = $request->query('status');
        $cinema_id = $request->query('cinema_id');
        $start_date = $request->query('start_date');
        $end_date = $request->query('end_date');
        // $month = $request->query('month', now()->format('Y-m'));
        $year = $request->query('year', now()->year);
        $day = $request->query('day', now()->format('Y-m-d'));

        // Gọi hàm lọc từ service
        if (empty($status)) {
            $status = ['Đã in vé', 'Thanh toán thành công'];
        }
        //bookingRevenue trả về dữ liệu đơn hàng đã đặt và thanh toán
        $bookingRevenue = $this->dashboardAdminService->revenuebooking(
            $status,
            $cinema_id
        );

        $movieRevenue = $this->dashboardAdminService->movierevenue($bookingRevenue);

        $dayRevenue = $this->dashboardAdminService->dayrevenue($bookingRevenue, $day);
        $monthRevenue = $this->dashboardAdminService->monthrevenue($bookingRevenue, $day);
        $yearRevenue = $this->dashboardAdminService->yearrevenue($bookingRevenue, $day);

        $cinemaRevenue = $this->dashboardAdminService->cinemarevenue($bookingRevenue);
        $monthlyRevenueChart = $this->dashboardAdminService->monthlyRevenue($status, $cinema_id, $year);
        $dailyRevenueChart = $this->dashboardAdminService->revenueByDateRange($bookingRevenue, $start_date, $end_date);

        $chartSeats = $this->dashboardAdminService->chartseats($bookingRevenue);

        return response()->json([
            'status' => true,
            'message' => 'Success',
            'day_revenue' => $dayRevenue,
            'month_revenue' => $monthRevenue,
            'year_revenue' => $yearRevenue,
            'cinema_chart_revenue' => $cinemaRevenue,
            'monthly_revenue_chart' => $monthlyRevenueChart,
            'daily_revenue_chart' => $dailyRevenueChart,
            'chart_seats' => $chartSeats,
            'booking_revenue' => $bookingRevenue,
            'movie_revenue' => $movieRevenue,
        ], 200);
    }

    public function dashboardMovie(Request $request){

        $movie_id = $request->query('movie_id');
        if (empty($movie_id)) {
            return $this->error('Vui lòng cung cấp movie_id');
        }

        $status = $request->query('status');
        $cinema_id = $request->query('cinema_id');
        $start_date = $request->query('start_date');
        $end_date = $request->query('end_date');
        
        $movieRevenue = $this->dashboardAdminService->dashboardMovie($movie_id, $status, $cinema_id, $start_date, $end_date);
        $daychart = $this->dashboardAdminService->daymoviechart($movieRevenue, $start_date, $end_date);
        $cinema_movie_chart = $this->dashboardAdminService->cinemamoviechart($movieRevenue);

        $listmovie = $this->dashboardAdminService->listmovie($movieRevenue);
        $movie_name = $this->dashboardAdminService->getMovieNameById($movie_id);
        return response()->json([
            'status' => true,
            'message' => 'Success',
            'movie_name' => $movie_name,
            'day_chart_movie' => $daychart,
            'cinema_movie_chart' => $cinema_movie_chart,
            'movie_dashboarch' => $listmovie,
          
        ], 200);
    }
}
