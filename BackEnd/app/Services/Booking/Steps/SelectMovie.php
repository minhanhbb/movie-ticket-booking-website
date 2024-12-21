<?php

namespace App\Services\Booking\Steps;

use App\Models\Movie;
use App\Services\Booking\Handlers\AbstractBookingStep;
use App\Models\MovieInCinema;
use App\Models\Showtime;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SelectMovie extends AbstractBookingStep
{
    /**
     * Xử lý yêu cầu chọn phim.
     *
     * @param Request $request
     * @return ?array
     */
    protected function process(Request $request): ?JsonResponse
    {
        // $error= [];

        $cinemaId = $request->input('cinemaId');
        $showtime_id = $request->input('showtime_id');

        if (!$showtime_id) {
            return response()->json([
                'status' => false,
                'message' => 'Cinema or Showtime not found.'
            ]);
        }
        $movies = Showtime::where('id', $showtime_id)
            ->with([
                'movie', // Nạp chi tiết phim
            ])->get();
        // if ($movies->isEmpty() || $movies->first()->showtimes->isEmpty()) {
        //     return response()->json([
        //         'status' => false,
        //         'message' => 'Cinema or Showtime not found.'
        //     ]);
        // }

        Session::put('reserved_showtime', compact('showtime_id', 'movies'));

        // return ['movies' => $movies];
        // return response()->json([
        //     'status' => true,
        //     'message' => 'Success',
        //     'data' => $movies
        // ]);
        return null;
    }
}
