<?php

namespace App\Services\News;

use App\Models\NewsCategory;
use App\Traits\AuthorizesInService;

/**
 * Class LocationService.
 */
class NewCategoryService
{use AuthorizesInService;

    public function index()
    {
        return NewsCategory::orderByDesc('created_at')->get();
    }


    public function store(array $data)
    {

        $new_category = NewsCategory::create($data);
        return $new_category;
    }

    public function update(int $id, array $data)
    {

        $new_category = NewsCategory::findOrFail($id);
        $new_category->update($data);
        return $new_category;
    }


    public function delete(int $id)
    {

        $new_category = NewsCategory::findOrFail($id);
        return $new_category->delete();
    }

    public function show(int $id)
    {
        $new_category = NewsCategory::findOrFail($id);
        return $new_category;
    }
}
