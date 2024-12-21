<?php

namespace App\Services\Cinema;

use App\Models\Location;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Traits\AuthorizesInService;

/**
 * Class LocationService.
 */
class LocationService
{
    use AuthorizesInService;

    public function index(): Collection
    {
        return Location::withCount('cinema')->orderByDesc('created_at')->get();
    }


    public function store(array $data): Location
    {

        return Location::create($data);
    }

    public function update(int $id, array $data): Location
    {

        $location = Location::findOrFail($id);
        $location->update($data);

        return $location;
    }


    public function delete(int $id): ?bool
    {
        $location = Location::findOrFail($id);
        return $location->delete();
    }
}
