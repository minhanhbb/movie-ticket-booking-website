{{-- resources/views/home.blade.php --}}
@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Welcome, {{ Auth::user()->name }}!</h1>
    <form action="{{ route('logout') }}" method="POST">
        @csrf
        <button type="submit" class="btn btn-danger">Logout</button>
    </form>
</div>
@endsection
