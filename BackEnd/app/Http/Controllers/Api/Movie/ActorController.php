<?php

namespace App\Http\Controllers\Api\Movie;

use App\Http\Controllers\Controller;
use App\Http\Requests\Movie\Store\StoreActorRequest;
use App\Http\Requests\Movie\Update\UpdateActorRequest;
use App\Models\ActorInMovie;
use App\Models\News;
use App\Services\Movie\ActorService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Str;

use function PHPUnit\Framework\isNull;

class ActorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $actorService;

    public function __construct(ActorService $actorService)
    {
        $this->actorService = $actorService;
    }

    public function index()
    {
        $actors = $this->actorService->index();
        return $this->success($actors, 'Danh sách diễn viên', 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreActorRequest $request)
    {
        try {
            $actor = $request->validated();
            $file = $request->file('photo');

            $actor['photo'] = $file ? $this->uploadImage($file) : null;

            if (isset($actor['actor_name'])) {
                $slug = Str::slug($actor['actor_name'], '-');
                $originalSlug = $slug;
                $count = 1;

                while ($this->actorService->slugExists($slug)) {
                    $slug = $originalSlug . '-' . $count;
                    $count++;
                }
                $actor['slug'] = $slug;
            }

            $actor = $this->actorService->store($actor);

            return $this->success($actor, 'Thêm thành công diễn viên', 200);
        } catch (Exception $e) {
            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $actor = $this->actorService->get($id);

            return $this->success($actor, 'Chi tiết diễn viên');
        } catch (Exception $e) {
            if ($e instanceof ModelNotFoundException) {
                return $this->notFound('Không tìm thấy diễn viên', 404);
            }

            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateActorRequest $request, string $id)
    {
        try {
            $file = $request->file('photo');
            $oldImgageActor = $this->actorService->get($id);

            $imageLink = $file ? $this->uploadImage($file) : $oldImgageActor->photo;

         

            $actor = $request->validated();
            $actor['photo'] = $imageLink;

            if (isset($actor['actor_name'])) {
                $slug = Str::slug($actor['actor_name']);
                $existingMovie = $this->actorService->findBySlug($slug); 
        
                if ($existingMovie && $existingMovie->id !== $id) {
                
                    $slug .= '-' . uniqid();
                }
        
                $actor['slug'] = $slug; 
            }

            $actor = $this->actorService->update($id, $actor);

            return $this->success($actor, 'Cập nhập thành công');
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
            $this->actorService->delete($id);
            return $this->success(null, 'Xóa thành công diễn viên');
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }

    public function filterNewByActor($id)
    {
        try {
            $movie = ActorInMovie::where('actor_id', $id)->pluck('movie_id');

            $new = News::WhereIn('movie_id', $movie)->get();

            if ($new->isEmpty()) {
                return $this->notFound('Không tìm thấy bài viết liên quan đến diễn viên', 404);
            }

            return $this->success($new, 'Bài viết liên quan đến diễn viên', 200);
        } catch (Exception $e) {
            return $this->error('Lỗi: ' . $e->getMessage(), 500);
        }
    }
}
