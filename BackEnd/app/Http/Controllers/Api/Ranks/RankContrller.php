<?php

namespace App\Http\Controllers\Api\Ranks;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreRanksRequest;
use App\Http\Requests\Update\UpdateRanksRequest;
use App\Models\Rank;
use App\Services\Ranks\RankService;
use Illuminate\Http\Request;

use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RankContrller extends Controller
{
    protected $rankService;

    public function __construct(RankService $rankService)
    {
        $this->rankService = $rankService;
    }

    public function index()
    {
        $paymethod = $this->rankService->index();
        return $this->success($paymethod);
    }
    public function show($id)
    {
        try {
            $paymethod = $this->rankService->get($id);


            return $this->success($paymethod);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }


    public function store(StoreRanksRequest $request)
    {
        $paymethod = $this->rankService->store($request->validated());
        return $this->success($paymethod);
    }

    public function update(UpdateRanksRequest $request, $id)
    {
        try {
            $paymethod = $this->rankService->update($id, $request->validated());
            return $this->success($paymethod);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function destroy($id)
    {
        try {
            return $this->success($this->rankService->delete($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function usePoints(Request $request)
    {
        $request->validate([
            // 'points_to_use' => 'required|integer|min:0|max:50000',
            'points_to_use' => 'required|integer|min:0',
            'total_price' => 'required|numeric|min:0',
            // 'booking_id' =>'integer'
        ]);

        $user = auth()->user();
        $pointsToUse = $request->points_to_use;
        $totalPrice = $request->total_price;
        // $booking_id = $request->booking_id;

        $data = $this->rankService->usePoints($user, $pointsToUse, $totalPrice);

        return response()->json($data, $data['success'] ? 200 : 400);
    }
    public function status(int $id)
    {
        $movie = Rank::findOrFail($id);
        $movie->status = $movie->status == 1 ? 0 : 1;
        $movie->save();
        return $this->success('', 'Cập nhật trạng thái thành công.', 200);
    }
}
