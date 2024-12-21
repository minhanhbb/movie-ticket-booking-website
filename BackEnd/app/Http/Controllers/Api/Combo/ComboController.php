<?php

namespace App\Http\Controllers\Api\Combo;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreComboRequest;
use App\Http\Requests\Update\UpdateComboRequest;
use App\Models\Combo;
use App\Services\Combo\ComboService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ComboController extends Controller
{
    protected $comboService;

    public function __construct(ComboService $comboService)
    {
        $this->comboService = $comboService;
    }

    public function index()
    {
        $combo = $this->comboService->index();
        return $this->success($combo);
    }
    public function show($id)
    {
        try {
            $combo = $this->comboService->get($id);

            return $this->success($combo);
        }catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    public function status(int $id)
    {
        $movie = Combo::findOrFail($id);
        $movie->status = $movie->status == 1 ? 0 : 1;
        $movie->save();
        return $this->success('', 'Cập nhật trạng thái thành công.', 200);
    }

    public function store(StoreComboRequest $request)
    {
        $combo = $this->comboService->store($request->validated());
        return $this->success($combo);

    }

    public function update(UpdateComboRequest $request, $id)
    {
        try {
            $combo = $this->comboService->update($id, $request->validated());
            return $this->success($combo);
        }catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function destroy($id)
    {
        try {
            return $this->success($this->comboService->delete($id));
        }catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}
