<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đặt vé thành công</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
            color: #333;
        }

        .email-container {
            background-color: #ffffff;
            margin: 40px auto;
            padding: 0;
            border-radius: 8px;
            max-width: 600px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            overflow: hidden;
        }

        .email-header {
            background-color: #ff6f61;
            color: #ffffff;
            text-align: center;
            padding: 20px 0;
        }

        .email-header h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: 1px;
        }

        .email-body {
            padding: 30px;
        }

        .email-body h2 {
            font-size: 22px;
            color: #ff6f61;
            margin-bottom: 20px;
        }

        .email-body p {
            font-size: 16px;
            line-height: 1.8;
            margin: 10px 0;
            color: #555;
        }

        .ticket-info {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            border-left: 4px solid #ff6f61;
        }

        .ticket-info h3 {
            font-size: 18px;
            color: #333;
            margin-top: 0;
        }

        .ticket-info p {
            font-size: 16px;
            margin: 5px 0;
            color: #666;
        }

        .highlight {
            color: #ff6f61;
            font-weight: bold;
        }

        .btn {
            display: inline-block;
            padding: 12px 20px;
            margin-top: 20px;
            background-color: #ff6f61;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-size: 16px;
        }

        .btn:hover {
            background-color: #e0554d;
        }

        .email-footer {
            text-align: center;
            padding: 20px;
            background-color: #333;
            color: #999;
            font-size: 14px;
        }

        .email-footer a {
            color: #ff6f61;
            text-decoration: none;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <h1>Xác Nhận Đặt Vé Thành Công</h1>
        </div>

        <!-- Body -->
        <div class="email-body">
            <h2>Kính gửi <span class="highlight">{{ $booking->user['user_name'] }}</span>,</h2>
            <p>Chúc mừng bạn đã đặt vé thành công tại
                <strong>{{ $booking->showtime->movie->cinema->cinema_name }}</strong>! Dưới đây là thông tin
                chi tiết về đặt vé của bạn:
            </p>
            <div class="ticket-info">
                <h3>Thông tin vé:</h3>
                <p><strong>Tên phim:</strong>{{ $booking->showtime->movie['movie_name'] }}</p>
                <p><strong>Suất chiếu:</strong>
                    {{ \Carbon\Carbon::parse($booking->showtime['showtime_start'])->format('H:i A') }} to
                    {{ \Carbon\Carbon::parse($booking->showtime['showtime_end'])->format('H:i A') }}</p>
                <p><strong>Rạp chiếu:</strong> {{ $booking->showtime->movie->cinema->cinema_name }}</p>
                <p><strong>Địa chỉ
                        rạp:</strong>{{ $booking->showtime->movie->cinema->location['location_name'] }}</p>
                <p><strong>Phòng chiếu:</strong> {{ $booking->showtime->room['room_name'] }}</p>
                <p><strong>Ghế ngồi:</strong>
                    @foreach ($booking->seats as $item)
                        {{ $item['name'] }}
                    @endforeach
                </p>
                <p><strong>Số lượng vé:</strong> {{ $booking->seats->count() }}</p>
                <p><strong>Tổng số tiền:</strong> {{ number_format($booking->amount) }} đ</p>
            </div>

            <div class="ticket-info">
                <h3>Thông tin thanh toán:</h3>
                <p><strong>Phương thức thanh toán:</strong> VnPay</p>
                <p><strong>Thời gian thanh toán:</strong> 12/12/20024 14:00</p>
                <p><strong>Mã đặt vé:</strong> {{ $booking->id }}</p>
            </div>

            <p>Vui lòng đến trước
                <strong>{{ \Carbon\Carbon::parse($booking->showtime['showtime_start'])->format('H:i A') }}</strong>
                phút để nhận vé và chuẩn bị cho buổi chiếu. Khi đến rạp, bạn có thể trình mã đặt vé tại quầy để nhận vé
                vào cửa.
            </p>

            <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline <strong>1900
                    1088</strong>.</p>

            <p>Xin cảm ơn và hẹn gặp lại tại
                <strong>{{ $booking->showtime->movie->cinema->cinema_name }}</strong>!
            </p>

            <a href="[Link đặt vé]" class="btn">Xem chi tiết đặt vé</a>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p><strong>{{ $booking->showtime->movie->cinema->cinema_name }}</strong> | <a
                    href="[Website rạp chiếu]">[Website rạp chiếu]</a> | Hotline: [Số điện thoại hỗ trợ]</p>
        </div>
    </div>
</body>

</html>
