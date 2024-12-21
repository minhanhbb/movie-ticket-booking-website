<?php

namespace App\Services\Movie;

use App\Models\Movie;
use App\Models\Rating;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use App\Traits\AuthorizesInService;

/**
 * Class MovieService.
 */
class RatingService
{
    use AuthorizesInService;
    public function index()
    {
        return Rating::orderByDesc('created_at')->get();
    }

    public function store(array $data)
    {
        $existingRating = Rating::where('user_id',  Auth::id())
            ->where('movie_id',  $data['movie_id'])
            ->first();

        if ($existingRating) {
            $existingRating->rating = $data['rating'];
            $existingRating->review = $data['review'];
            $existingRating->save();

            $message = 'Rating updated successfully';
        } else {
            $existingRating = Rating::create([
                'user_id'    => Auth::id(),
                'movie_id'   => $data['movie_id'],
                'rating'     => $data['rating'],
                'review'     => $data['review'],
            ]);
            $message = 'Rating created successfully';
        }

        $averageRating = Rating::where('movie_id', $data['movie_id'])->avg('rating');

        $movie = Movie::find($data['movie_id']);
        $movie->rating = $averageRating;
        $movie->save();

        return response()->json([
            'message' => $message,
            'rating'  => $existingRating
        ]);
    }

    public function update(int $id, array $data) {}

    public function delete(int $id)
    {
        $favorite = Rating::where('user_id', Auth::id())
            ->where('movie_id', $id)
            ->firstOrFail();
        return $favorite->delete();
    }

    public function show(int $id)
    {
        $movie = Rating::with('user')->where('movie_id', $id)->get();

        return $movie;
    }
}
