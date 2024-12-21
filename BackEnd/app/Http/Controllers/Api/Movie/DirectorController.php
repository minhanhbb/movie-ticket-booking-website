<?php

namespace App\Http\Controllers\Api\Movie;

use App\Http\Controllers\Controller;
use App\Http\Requests\Movie\Store\StoreDirectorRequest;
use App\Http\Requests\Movie\Update\UpdateDirectorRequest;
use App\Models\DirectorInMovie;
use App\Models\News;
use App\Services\Movie\DirectorService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;


class DirectorController extends Controller
{
    protected $directorService;

    public function __construct(DirectorService $directorService)
    {
        $this->directorService = $directorService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $directs = $this->directorService->index();
        return $this->success($directs, 'Danh sách đạo diễn', 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDirectorRequest $request)
    {
        try {
            $file = $request->file('photo');
            $imageLink = $file ? $this->uploadImage($file) : null;

            $direct = $request->validated();
            $direct['photo'] = $imageLink;

            if (isset($direct['director_name'])) {
                $slug = Str::slug($direct['director_name'], '-');
                $originalSlug = $slug;
                $count = 1;

                while ($this->directorService->slugExists($slug)) {
                    $slug = $originalSlug . '-' . $count;
                    $count++;
                }
                $direct['slug'] = $slug;
            }

            $direct = $this->directorService->store($direct);
            return $this->success($direct, 'Thêm thành công đạo diễn');
        } catch (Exception $e) {
            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $director = $this->directorService->get($id);

            return $this->success($director, 'Chi tiết đạo diễn với id = ' . $id);
        } catch (Exception $e) {
            if ($e instanceof ModelNotFoundException) {
                return $this->notFound('Không tìm thấy id director', 404);
            }

            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDirectorRequest $request, string $id)
    {

        try {
            $file = $request->file('photo');
            $oldImagedirector = $this->directorService->get($id);

            $direct = $request->validated();
            $direct['photo'] = $file ? $this->uploadImage($file) : $oldImagedirector->photo;

            if (isset($direct['director_name'])) {
                $slug = Str::slug($direct['director_name']);
                $existingMovie = $this->directorService->findBySlug($slug);

                if ($existingMovie && $existingMovie->id !== $id) {

                    $slug .= '-' . uniqid();
                }

                $direct['slug'] = $slug;
            }

            $direct = $this->directorService->update($id, $direct);
            return $this->success($direct, 'Cập nhập thành công');
        } catch (Exception $e) {
            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $this->directorService->delete($id);
            return $this->success(null, 'Xóa thành công đạo diễn');
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    public function filterNewByDictor($id)
    {
        try {
            $movie = DirectorInMovie::where('director_id', $id)->pluck('movie_id');
            $new = News::whereIn('movie_id', $movie)->get();

            if ($new->isEmpty()) {
                return $this->notFound('Không tìm thấy bài viết liên quan đến đạo diễn', 404);
            }

            return $this->success($new, 'Bài viết liên quan đến đạo diễn', 200);
        } catch (Exception $e) {
            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }
}
