<?php

namespace App\Services\Movie;

use App\Models\Director;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Traits\AuthorizesInService;

/**
 * Class MovieService.
 */
class DirectorService
{
    use AuthorizesInService;
    public function index(): Collection
    {
        return Director::orderByDesc('created_at')->get();
    }

    public function store(array $data): Director
    {

        return Director::create($data);
    }

    public function update(int $id, array $data): Director
    {

        $director = Director::query()->findOrFail($id);
        $director->update($data);

        return $director;
    }

    public function delete(int $id): ?bool
    {

        $director = Director::query()->findOrFail($id);
        return $director->delete();
    }

    // public function get(int $id): Director
    // {
    //     return Director::query()->findOrFail($id);
    // }

    public function get($identifier): Director
    {
        $Director = Director::query()
            ->when(is_numeric($identifier), function ($query) use ($identifier) {
                return $query->where('id', $identifier);
            }, function ($query) use ($identifier) {
                return $query->where('slug', $identifier);
            })
            ->firstOrFail();

        return $Director;
    }

    public function slugExists($slug)
    {
        return Director::where('slug', $slug)->exists();
    }

    public function findBySlug($slug)
    {
        return Director::where('slug', $slug)->first();
    }
}
