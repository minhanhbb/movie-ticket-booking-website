<?php

namespace App\Http\Controllers\Api\VipMembership;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VipMembership;

class VipMembershipController extends Controller
{
    public function activateVip(Request $request)
    {
        $user = $request->user();

        $vip = VipMembership::create([
            'user_id' => $user->id,
            'start_date' => now(),
            'end_date' => now()->addYear(), // Thành viên VIP kéo dài 1 năm
            'is_active' => true,
        ]);

        return response()->json(['message' => 'Kích hoạt thành viên VIP thành công.', 'vip' => $vip]);
    }

    public function checkVipStatus(Request $request)
    {
        $user = $request->user();

        $vip = VipMembership::where('user_id', $user->id)
            ->where('is_active', true)
            ->where('end_date', '>=', now())
            ->first();

        if ($vip) {
            return response()->json(['message' => 'Bạn là thành viên VIP.', 'vip' => $vip]);
        }

        return response()->json(['message' => 'Bạn không phải là thành viên VIP.']);
    }
}
