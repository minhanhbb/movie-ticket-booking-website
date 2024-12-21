<!-- resources/views/register.blade.php -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <style>
        .g-recaptcha {
            margin: 20px 0;
        }
    </style>
    
</head>
<body>
    <h1>Register</h1>
    <form action="{{ route('register.submit') }}" method="POST">
        @csrf
        <label for="user_name">Username:</label>
        <input type="text" id="user_name" name="user_name" value="{{ old('user_name') }}">
        @error('user_name')
            <p>{{ $message }}</p>
        @enderror

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" value="{{ old('email') }}">
        @error('email')
            <p>{{ $message }}</p>
        @enderror

        <label for="password">Password:</label>
        <input type="password" id="password" name="password">
        @error('password')
            <p>{{ $message }}</p>
        @enderror

        <label for="password_confirmation">Confirm Password:</label>
        <input type="password" id="password_confirmation" name="password_confirmation">
        @error('password_confirmation')
            <p>{{ $message }}</p>
        @enderror

        <div class="g-recaptcha" data-sitekey="{{ env('RECAPTCHA_SITE_KEY') }}"></div>
        @error('g-recaptcha-response')
            <p>{{ $message }}</p>
        @enderror

        <button type="submit">Register</button>
    </form>
<script src="https://www.google.com/recaptcha/api.js" async defer></script>

</body>

</html>
