<!DOCTYPE html>
<html>
<head>
    <title>Role Management</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
            <a class="navbar-brand" href="{{ url('/') }}">Home</a>
        </div>
    </nav>
    <main class="py-4">
        @yield('content')
    </main>
</body>
</html>
