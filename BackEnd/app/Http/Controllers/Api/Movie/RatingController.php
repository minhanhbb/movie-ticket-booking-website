<?php

namespace App\Http\Controllers\Api\Movie;

use App\Http\Controllers\Controller;
use App\Http\Requests\Movie\Store\StoreRatingRequest;
use App\Models\Rating;
use App\Services\Movie\RatingService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RatingController extends Controller
{

    protected $ratingService;

    public function __construct(RatingService $ratingService)
    {
        $this->ratingService = $ratingService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index() {
        $rating = $this->ratingService->index();

        $formattedRatings = $rating->map(function ($rating) {
            $ratingdata = $rating->toArray();
            $user = $rating->user;

            $ratingdata['movie_name'] = $rating->movies ? $rating->movies->movie_name : 'Không có tên phim';
            $ratingdata['user_name'] = $rating->user->user_name;
            $ratingdata['user'] = $user->toArray();
            return $ratingdata;
        });

        return $this->success($formattedRatings, 'Danh sách đánh giá!', 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRatingRequest $request)
    {
        try {
            $rating = $this->ratingService->store($request->validated());

            return $this->success($rating, 'Đánh giá thành công');
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
            $ratings = $this->ratingService->show($id);

            if ($ratings->isEmpty()) {
                return $this->notFound('Bộ phim chưa có đánh giá nào!', 404);
            }

            $formattedRatings = $ratings->map(function ($rating) {
                $ratingdata = $rating->toArray();

                $ratingdata['movie_name'] = $rating->movies ? $rating->movies->movie_name : 'Không có tên phim';
                $ratingdata['user_name'] = $rating->user->user_name;
                return $ratingdata;
            });

            return $this->success($formattedRatings, 'Danh sách đánh giá phim', 200);
        } catch (Exception $e) {

            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $this->ratingService->delete($id);
            return $this->success(null, 'Xóa thành công');
        } catch (Exception $e) {


            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }
}
