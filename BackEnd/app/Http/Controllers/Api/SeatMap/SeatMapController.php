<?php

namespace App\Http\Controllers\Api\SeatMap;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreSeatMapRequest;
use App\Http\Requests\Update\UpdateSeatMapRequest;
use App\Models\SeatMap;
use App\Services\SeatMap\SeatMapService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;

class SeatMapController extends Controller
{
    protected $seatMapService;

    public function __construct(SeatMapService $seatMapService)
    {
        $this->seatMapService = $seatMapService;
    }

    public function index(): JsonResponse
    {
        $seatMaps = $this->seatMapService->getAll();
        return response()->json($seatMaps);
    }

    public function show(int $id): JsonResponse
    {
        try {
            $seatMap = $this->seatMapService->getById($id);
            return response()->json($seatMap);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Seat map not found'], 404);
        }
    }

    public function store(StoreSeatMapRequest $request): JsonResponse
    {
        $seatMap = $this->seatMapService->create($request->validated());
        return response()->json($seatMap, 201);
    }

    public function update(UpdateSeatMapRequest $request, int $id): JsonResponse
    {
        try {
            $seatMap = $this->seatMapService->update($id, $request->validated());
            return response()->json($seatMap);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Seat map not found'], 404);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->seatMapService->delete($id);
            return response()->json(['message' => 'Seat map deleted successfully']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Seat map not found'], 404);
        }
    }
    public function status(int $id)
    {
        $movie = SeatMap::findOrFail($id);
        $movie->status = $movie->status == 1 ? 0 : 1;
        $movie->save();
        return $this->success('', 'Cập nhật trạng thái thành công.', 200);
    }
}
