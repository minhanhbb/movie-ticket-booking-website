<?php

namespace App\Http\Controllers\Api\Cinema;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreLocationRequest;
use Illuminate\Http\Request;
use App\Services\Cinema\LocationService;
use App\Http\Requests\update\UpdateLocationRequest;
use App\Models\Location;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class LocationController extends Controller
{

    protected $locationService;

    public function __construct(LocationService $locationService)
    {
        $this->locationService = $locationService;
    }

    public function index()
    {
        $locations = $this->locationService->index();
        return $this->success($locations);
    }

    public function store(StoreLocationRequest $request)
    {
        $location = $this->locationService->store($request->validated());
        return $this->success($location);

    }

    public function update(UpdateLocationRequest $request, $id)
    {
        try {
            $location = $this->locationService->update($id, $request->validated());
            return $this->success($location);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function destroy($id)
    {
        try {
            return $this->success($this->locationService->delete($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}

