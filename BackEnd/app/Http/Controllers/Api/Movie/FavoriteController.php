<?php

namespace App\Http\Controllers\Api\Movie;

use App\Http\Controllers\Controller;
use App\Http\Requests\Movie\Store\StoreFavoriteRequest;
use App\Models\Favorite;
use App\Services\Movie\FavoriteService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class FavoriteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $favoriteService;

    public function __construct(FavoriteService $favoriteService)
    {
        $this->favoriteService = $favoriteService;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(string $movie)
    {
        try {
            $movieId = is_numeric($movie) ? $movie : $this->favoriteService->getMovieIdBySlug($movie);
    
            $this->favoriteService->store($movieId);
            return $this->success([], 'Yêu thích phim thành công', 200);
        } catch (HttpException $e) {
            // Xử lý lỗi chung
            return $this->error('Lỗi: ' . $e->getMessage(), $e->getStatusCode());
        }
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $this->favoriteService->delete($id);
            return $this->success(null, 'Xóa thành công');
        } catch (Exception $e) {
            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }
}
