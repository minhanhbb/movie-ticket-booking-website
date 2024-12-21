<?php

namespace App\Http\Controllers\Api\Seat;

use App\Http\Controllers\Controller;
use App\Models\Showtime;
use App\Services\Cinema\SeatService as CinemaSeatService;
use App\Services\seat\SeatService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class SeatController extends Controller
{
    protected $seatService;

    public function __construct(CinemaSeatService $seatService)
    {
        $this->seatService = $seatService;
    }

    public function index()
    {
        $seat = $this->seatService->index();
        return $this->success($seat);
    }




    // public function store(StoreShowtimeRequest $request)
    // {
    //     $showtime = $this->showtimeService->store($request->validated());
    //     return $this->success($showtime);
    // }

    // public function update(UpdateShowtimeRequest $request, $id)
    // {
    //     try {
    //         $showtime = $this->showtimeService->update($id, $request->validated());
    //         return $this->success($showtime);
    //     } catch (Exception $e) {
    //         return $e->getMessage();
    //     }
    // }

    // public function destroy($id)
    // {
    //     try {
    //         return $this->success($this->showtimeService->delete($id));
    //     } catch (Exception $e) {
    //         return $e->getMessage();
    //     }
    // }

    public function show($id)
    {
        try {
            $seat = $this->seatService->get($id);
            if ($seat->isEmpty()) {
                return $this->notFound();
            }
            return $this->success($seat);
        } catch (ModelNotFoundException $e) {
            return $this->notFound();
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

}
