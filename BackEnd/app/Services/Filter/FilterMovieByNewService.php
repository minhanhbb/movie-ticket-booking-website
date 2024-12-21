<?php

namespace App\Services\Filter;

use App\Models\News;

class FilterMovieByNewService
{
    public function filterMovieByNew($moviename)
    {
        $new = News::where('content', 'like', '%' . $moviename . '%')->get();
        return $new;
    }
}
