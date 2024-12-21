<?php

namespace App\Http\Controllers\Api\Movie;

use App\Http\Controllers\Controller;
use App\Http\Requests\Movie\Store\StoreMovieCategoryRequest;
use App\Http\Requests\Movie\Update\UpdateMovieCategoryRequest;
use App\Services\Movie\MovieCategoryService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class MovieCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $movieCategroyService;

    public function __construct(MovieCategoryService $movieCategroyService)
    {
        $this->movieCategroyService = $movieCategroyService;
    }
    public function index()
    {
        $movieCategory = $this->movieCategroyService->index();
        return $this->success($movieCategory, 'Danh sách danh mục phim', 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMovieCategoryRequest $request)
    {
        try {
            $movieCategory = $this->movieCategroyService->store($request->validated());

            return $this->success($movieCategory, 'Thêm thành công danh mục');
        } catch (Exception $e) {
            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $movieCategory = $this->movieCategroyService->get($id);

            return $this->success($movieCategory, 'Chi tiết danh mục với id = ' . $id);
        } catch (Exception $e) {
            if ($e instanceof ModelNotFoundException) {
                return $this->notFound('Category not found id = ' . $id, 404);
            }

            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMovieCategoryRequest $request, string $id)
    {
        try {
            $movieCategory = $this->movieCategroyService->update($id, $request->validated());
            return $this->success($movieCategory, 'Update thành công');
        } catch (Exception $e) {
            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $this->movieCategroyService->delete($id);

            return $this->success(null, 'Xóa thành công');
        } catch (Exception $e) {
            if ($e instanceof ModelNotFoundException) {
                return $this->notFound('Category not found id = ' . $id, 404);
            }

            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }
}
