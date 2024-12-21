<?php

namespace App\Services\Movie;

use App\Models\Favorite;
use App\Models\Movie;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Traits\AuthorizesInService;
use Illuminate\Support\Facades\Log;

/**
 * Class MovieService.
 */
class FavoriteService
{
    use AuthorizesInService;
    public function index(): Collection
    {
        return Favorite::all();
    }

    public function store($input): Favorite
    {
        $movie = Movie::where('id', $input)->orWhere('slug', $input)->first();

        if (!$movie) {
            throw new HttpException(404, 'Phim không tồn tại!');
        }

        $existingFavorite = Favorite::where('user_id', Auth::id())
            ->where('movie_id', $movie->id)
            ->first();

        if ($existingFavorite) {
            throw new HttpException(409, 'Phim đã được yêu thích!');
        }

        return Favorite::create([
            'user_id' => Auth::id(),
            'movie_id' => $movie->id,
        ]);
    }

    public function delete(int $id): ?bool
    {
        $favorite = Favorite::where('user_id', Auth::id())
            ->where('movie_id', $id)
            ->first();

            if(!$favorite){
                throw new HttpException(404, 'ID phim không tồn tại');
            }
            
        return $favorite->delete();
    }

    public function get(int $id): Favorite
    {
        return Favorite::query()->findOrFail($id);
    }

    public function getMovieIdBySlug($slug)
    {
        $movie = Movie::where('slug', $slug)->first();

        if (!$movie) {
            throw new HttpException(404, 'Phim không tồn tại!');
        }

        return $movie->id;
    }
}
