<?php

namespace App\Http\Controllers\Api\SeatMap;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreMatrixRequest;
use App\Http\Requests\Update\UpdateMatrixRequest;
use App\Models\SeatLayout;
use App\Services\SeatMap\MatrixService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MatrixController extends Controller
{
    protected $matrixService;

    public function __construct(MatrixService $matrixService)
    {
        $this->matrixService = $matrixService;
    }

    public function index()
    {
        $combo = $this->matrixService->index();
        return $this->success($combo);
    }
    public function show($id)
    {
        try {
            $combo = $this->matrixService->get($id);

            return $this->success($combo);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    public function status(int $id)
    {
        $movie = SeatLayout::findOrFail($id);
        $movie->status = $movie->status == 1 ? 0 : 1;
        $movie->save();
        return $this->success('', 'Cập nhật trạng thái thành công.', 200);
    }


    public function store(StoreMatrixRequest $request)
    {
        try {
            $combo = $this->matrixService->store($request->validated());
            return response()->json(['message' => 'Matrix created successfully!', 'data' => $combo], 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }


    public function update(UpdateMatrixRequest $request, $id)
    {
        try {
            $combo = $this->matrixService->update($id, $request->validated());
            return response()->json(['message' => 'Matrix updated successfully!', 'data' => $combo]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => "Không tìm thấy id {$id} trong cơ sở dữ liệu"], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }


    public function destroy($id)
    {
        try {
            return $this->success($this->matrixService->delete($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

}
