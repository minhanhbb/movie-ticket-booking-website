<?php

namespace App\Http\Controllers\Api\Role;

use App\Http\Controllers\Controller;
use App\Models\User as ModelsUser; // Ensure this is your User model
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
// use App\Models\Role;
use App\Models\User;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $currentUser = $request->user();
        $loggedInUserId = $currentUser->id;

        $roles = Role::all();
        $permissions = Permission::all();

        if ($currentUser->hasRole('admin')) {
            // Nếu là admin, hiển thị tất cả trừ tài khoản đang đăng nhập
            $users = ModelsUser::where('id', '!=', $loggedInUserId)->get();

        } elseif ($currentUser->hasRole('manager')) {
            // Nếu là manager, hiển thị tài khoản cùng cinema_id và các tài khoản không gán cinema.
            $users = ModelsUser::where('id', '!=', $loggedInUserId)
                ->where(function ($query) use ($currentUser) {
                    $query->where('cinema_id', $currentUser->cinema_id)
                        ->orWhereNull('cinema_id');
                })
                ->whereDoesntHave('roles', function ($q) {
                    $q->where('name', 'admin');  // Loại bỏ các tài khoản có quyền admin
                })
                ->get();

        } else {
            // Người dùng thường (role user)
            $users = ModelsUser::where('id', '!=', $loggedInUserId)->get();
        }

        return $this->success([
            'roles' => $roles,
            'users' => $users,
            'permissions' => $permissions
        ]);
    }


    public function show($id)
    {
        $userWithRoles = User::with('roles')->findOrFail($id);
        return $this->success([
            'user' => $userWithRoles,
            'roles' => $userWithRoles->roles
        ], 'success', 200);
    }
    public function syncRoles(Request $request, User $user)
    {
        // Lấy thông tin người dùng hiện tại
        $currentUser = auth()->user();

        // Kiểm tra quyền của người dùng hiện tại
        if ($currentUser->hasRole('manager')) {
            // Người dùng Manager chỉ được gán vai trò Staff hoặc Manager
            if (!empty(array_diff($request->roles, ['staff', 'manager']))) {
                return response()->json([
                    'message' => 'Bạn chỉ được phép gán vai trò "nhân viên" và "quản lý".'
                ], 403);
            }
        }

        // Validate dữ liệu
        $validated = $request->validate([
            'roles' => 'array|required',
            'cinema_id' => 'nullable|exists:cinema,id',
        ]);

        // Gán roles cho user
        $user->syncRoles($validated['roles']);

        // Xử lý cinema_id dựa trên vai trò và quyền của user hiện tại
        if ($currentUser->hasRole('manager')) {
            // Manager chỉ có thể gán quyền staff/manager và cinema_id của chính họ
            $user->cinema_id = $currentUser->cinema_id;
        } elseif ($currentUser->hasRole('admin')) {
            // Admin có thể gán quyền và cinema_id từ request
            $user->cinema_id = $validated['cinema_id'];
        }

        // Nếu vai trò không phải staff hoặc manager, xóa cinema_id
        if (!in_array('manager', $validated['roles']) && !in_array('staff', $validated['roles'])) {
            $user->cinema_id = null;
        }

        // Lưu lại thông tin người dùng
        $user->save();

        return response()->json([
            'message' => 'Vai trò và điện ảnh được gán thành công.'
        ], 200);
    }







    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'cinema_id' => 'nullable|integer|exists:cinema,id', // Thêm ràng buộc cinema_id
        ]);

        $role = Role::create(['name' => $request->name]);

        if ($request->cinema_id) {
            // Gán cinema_id cho manager
            $role->cinema_id = $request->cinema_id;
            $role->save();
        }

        return $this->success($role, 'Role created successfully', 201);
    }


    public function syncPermissions(Request $request, Role $role)
    {
        return $role->syncPermissions($request->permissions);
    }

    // public function syncRoles(Request $request, User $user)
    // {
    //     return $user->syncRoles($request->roles);
    // }

    public function destroy(Role $role)
    {
        $role->delete();
        return $this->success([], 'delete succuess', 200);
    }

    public function destroyUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return $this->success([], 'delete succuess', 200);
    }

    public function status(int $id)
    {
        $movie = User::findOrFail($id);
        $movie->status = $movie->status == 1 ? 0 : 1;
        $movie->save();
        return $this->success('', 'Cập nhật trạng thái thành công.', 200);
    }
}
