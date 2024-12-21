<?php

namespace App\Http\Controllers\Api\News;

use App\Http\Controllers\Controller;
use App\Http\Requests\NewCategory\StoreNewsCategoryRequest;
use App\Http\Requests\NewCategory\UpdateNewsCategoryRequest;
use App\Services\News\NewCategoryService;
use Illuminate\Http\Request;

class NewCategoryController extends Controller
{
    protected $newcategoryservice;
    public function __construct(NewCategoryService $newcategoryservice)
    {
        $this->newcategoryservice = $newcategoryservice;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $newcategory = $this->newcategoryservice->index();
        return $this->success($newcategory, 'success');
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function create(string $id)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNewsCategoryRequest $request)
    {
        $newcategory = $this->newcategoryservice->store($request->validated());
        return $this->success($newcategory, 'success');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $newcategory = $this->newcategoryservice->show($id);
        return $this->success($newcategory, 'success');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(string $id,UpdateNewsCategoryRequest $request)
    {
        try {
            $newcategory = $this->newcategoryservice->update($id,$request->validated());
            return $this->success($newcategory, 'success');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $newcategory = $this->newcategoryservice->delete($id);
            return $this->success($newcategory, 'success');
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }
}
