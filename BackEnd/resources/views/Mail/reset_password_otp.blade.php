<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code for Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            font-size: 24px;
            color: #333;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
            color: #555;
        }
        h2 {
            font-size: 32px;
            color: #007BFF;
            margin: 20px 0;
            font-weight: bold;
            letter-spacing: 2px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>Mã OTP của bạn</h1>
        <p>Đây là mã OTP để đặt lại mật khẩu của bạn:</p>
        <h2>{{ $otp }}</h2>
        <p>Mã này có hiệu lực trong 5 phút. Vui lòng sử dụng nó càng sớm càng tốt để bảo vệ tài khoản của bạn.</p>
        <p class="footer">Nếu bạn không đổi mật khẩu, không cần thêm thao tác nào.</p>
    </div>
</body>
</html>
