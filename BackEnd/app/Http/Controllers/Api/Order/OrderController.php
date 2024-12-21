<?php

namespace App\Http\Controllers\Api\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\UpdateOrderRequest;
use App\Models\Booking;
use App\Services\Order\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index()
    {
        //author
        $order = $this->orderService->index();
        return $this->success($order, 'success');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = $this->orderService->show($id);
        return $this->success($order, 'success');
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
    public function update(UpdateOrderRequest $request, string $id)
    {
        $request->validated();
        $updatedOrder = $this->orderService->update($request->status, $id);
        return $this->success($updatedOrder, 'Trạng thái đã được cập nhật thành công.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $order = $this->orderService->destroy($id);
        return $this->success($order, 'success');
    }


    public function order()
    {
        $order = $this->orderService->order();
        return $this->success($order, 'success');
    }
    public function printTicket(int $id)
    {
        $movie = Booking::findOrFail($id);
        if ($movie->status == 'Thanh toán thành công') {
            $movie->status = $movie->status == 'Đã in vé';
            $movie->save();
            return $this->success('', 'In vé thành công', 200);
        } else {
            return $this->success('', 'In vé không thành công', 200);
        }
    }
}
