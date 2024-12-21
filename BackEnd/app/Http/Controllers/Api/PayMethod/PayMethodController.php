<?php

namespace App\Http\Controllers\Api\PayMethod;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StorePayMethodRequest;
use App\Http\Requests\Update\UpdatePayMethodRequest;
use App\Models\PayMethod;
use Illuminate\Http\Request;
use App\Services\PayMethod\PayMethodService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PayMethodController extends Controller
{
    protected $paymethodService;

    public function __construct(PayMethodService $paymethodService)
    {
        $this->paymethodService = $paymethodService;
    }

    public function index()
    {
        $paymethod = $this->paymethodService->index();
        return $this->success($paymethod);
    }
    public function show($id)
    {
        try {
            $paymethod = $this->paymethodService->get($id);


            return $this->success($paymethod);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    public function status(int $id)
    {
        $movie = PayMethod::findOrFail($id);
        $movie->status = $movie->status == 1 ? 0 : 1;
        $movie->save();
        return $this->success('', 'Cập nhật trạng thái thành công.', 200);
    }

    public function store(StorePayMethodRequest $request)
    {
        $paymethod = $this->paymethodService->store($request->validated());
        return $this->success($paymethod);
    }

    public function update(UpdatePayMethodRequest $request, $id)
    {
        try {
            $paymethod = $this->paymethodService->update($id, $request->validated());
            return $this->success($paymethod);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function destroy($id)
    {
        try {
            return $this->success($this->paymethodService->delete($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}
