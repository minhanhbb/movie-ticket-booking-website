<?php

namespace App\Http\Controllers\Api\News;

use App\Http\Controllers\Controller;
use App\Http\Requests\News\StoreNewsRequest;
use App\Http\Requests\News\UpdateNewsRequest;
use App\Models\News;
use App\Services\News\NewService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NewController extends Controller
{
    protected $newservice;
    public function __construct(NewService $newservice)
    {
        $this->newservice = $newservice;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $new = $this->newservice->index();
        return $this->success($new, 'success');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }
    public function status(int $id)
    {
        $movie = News::findOrFail($id);
        $movie->status = $movie->status == 1 ? 0 : 1;
        $movie->save();
        return $this->success('', 'Cập nhật trạng thái thành công.', 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNewsRequest $request)
    {
        $thumbnailFile = $request->file('thumnail');
        $bannerFile = $request->file('banner');

        $thumbnailLink = $this->uploadImage($thumbnailFile);
        $bannerLink = $this->uploadImage($bannerFile);

        $new = $request->validated();

        $new['thumnail'] = $thumbnailLink;
        $new['banner'] = $bannerLink;
        $new['user_id'] = Auth::user()->id;
        $new = $this->newservice->store($new);
        return $this->success($new, 'Thêm thành công');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {

        $new = $this->newservice->show($id);
        return $this->success($new, 'success');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(string $id, UpdateNewsRequest $request)
    {
        try {
            $thumbnailFile = $request->file('thumnail');
            if ($thumbnailFile) {
                $thumbnailLink = $this->uploadImage($thumbnailFile);
            } else {
                $thumbnailLink = null;
            }

            $bannerFile = $request->file('banner');
            if ($bannerFile) {
                $bannerLink = $this->uploadImage($bannerFile);
            } else {
                $bannerLink = null;
            }

            $new = $request->validated();
            if ($thumbnailLink) {
                $new['thumnail'] = $thumbnailLink;
            }
            if ($bannerLink) {
                $new['banner'] = $bannerLink;
            }
            $new = $this->newservice->update($id, $new);
            return $this->success($new, 'Sửa Thành công');
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
            $new = $this->newservice->delete($id);
            return $this->success($new, 'xoá thành công');
        }catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (\Throwable $th) {
            return $this->error($th->getMessage());
        }
    }

    public function newByCategory($id){
        try{
            $news = News::where('news_category_id', $id)->get();

            if($news->isEmpty()){
                return $this->notFound('Không tìm thấy news theo new_category', 404);
            }

            return $this->success($news, 'Danh sách News', 200);

        }catch(\Throwable $th){
            return $this->error($th->getMessage());

        }
    }
}
