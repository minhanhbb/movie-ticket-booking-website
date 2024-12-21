@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Edit Role - {{ $role->name }}</h1>

    <form action="{{ route('roles.update', $role) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="mb-3">
            <label for="name" class="form-label">Role Name</label>
            <input type="text" name="name" id="name" class="form-control" value="{{ $role->name }}" required>
        </div>
        <button type="submit" class="btn btn-success">Save</button>
    </form>

    <h3 class="mt-5">Assign Permissions</h3>
    <form action="{{ route('roles.syncPermissions', $role) }}" method="POST">
        @csrf
        <div class="mb-3">
            @foreach($permissions as $permission)
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="permissions[]" value="{{ $permission->name }}"
                           id="permission-{{ $permission->id }}"
                           {{ $role->hasPermissionTo($permission->name) ? 'checked' : '' }}>
                    <label class="form-check-label" for="permission-{{ $permission->id }}">
                        {{ $permission->name }}
                    </label>
                </div>
            @endforeach
        </div>
        <button type="submit" class="btn btn-primary">Update Permissions</button>
    </form>
</div>
@endsection
