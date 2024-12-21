<?php

namespace App\Http\Controllers\Api\Filter;

use App\Http\Controllers\Controller;
use App\Services\Filter\FilterMovieByNewService;
use Illuminate\Http\Request;

class FilterMovieByNewController extends Controller
{
    protected $FilterMovieByNew;
    public function __construct(FilterMovieByNewService $FilterMovieByNew)
    {
        $this->FilterMovieByNew = $FilterMovieByNew;
    }

    public function filterMovieByNew(Request $request)
    {
        $movieid = $request->input('movie_name'); 
        $FilterMovieByNew = $this->FilterMovieByNew->filterMovieByNew($movieid);

        return $this->success($FilterMovieByNew);
    }
}
