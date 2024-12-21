<?php

namespace App\Services\SeatMap;

use App\Models\SeatLayout;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Traits\AuthorizesInService;

/**
 * Class LocationService.
 */
class MatrixService
{
    use AuthorizesInService;
    public function index(): Collection
    {

        return SeatLayout::orderByDesc('created_at')->get();

    }


    public function store(array $data): SeatLayout
    {
        // $this->authorizeInService('create', Combo::class);
        return SeatLayout::create($data);
    }

    public function update(int $id, array $data): SeatLayout
    {

        $combo = SeatLayout::findOrFail($id);
        $combo->update($data);
        return $combo;
    }


    public function delete(int $id): ?bool
    {

        $combo = SeatLayout::findOrFail($id);
        return $combo->delete();
    }
    public function get(int $id): SeatLayout
    {
        $combo = SeatLayout::findOrFail($id);
        return $combo;
    }
}
