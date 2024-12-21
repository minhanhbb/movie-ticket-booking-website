<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông Tin Vé</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
    <div style="background: #fff; width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
            <a href="http://localhost:5173" target="_blank" style="text-decoration: none; color: inherit;">
                <img src="https://imgur.com/Pd2gDuC.png" alt="logo" style="width: 50px; margin-right: 10px;">
            </a>
            <a href="http://localhost:5173" target="_blank" style="text-decoration: none; color: inherit;">
                <h1 style="font-size: 20px; font-weight: bold; color: red; margin: 0;">FlickHive</h1>
            </a>
        </div>
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="{{$booking->qrcode}}" alt="Barcode" style="width: 100%; max-width: 200px;">
            <h2 style="font-size: 12px; color: red; font-style: italic; margin: 10px 0;">Vui lòng đưa mã số này đến quầy vé FlickHive để nhận vé!</h2>
        </div>
        <div style="margin-bottom: 20px;">
            <p style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px; color: #555;"><span style="font-weight: bold;">Mã vé:</span><span>{{$booking->booking_code}}</span></p>
            <p style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px; color: #555;"><span style="font-weight: bold;">Tên phim:</span><span>{{$booking->showtime->movie->movie_name}}</span></p>
            <p style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px; color: #555;"><span style="font-weight: bold;">Rạp:</span><span>{{$booking->showtime->room->cinema->cinema_name}}</span></p>
            <p style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px; color: #555;"><span style="font-weight: bold;">Phòng chiếu:</span><span>{{$booking->showtime->room->room_name}}</span></p>
            <p style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px; color: #555;"><span style="font-weight: bold;">Suất chiếu:</span><span>{{ \Carbon\Carbon::parse($booking->showtime['showtime_start'])->format('H:i A') }} đến {{ \Carbon\Carbon::parse($booking->showtime['showtime_end'])->format('H:i A') }}</span></p>
            <p style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px; color: #555;"><span style="font-weight: bold;">Ghế:</span><span>
            @foreach ($booking->seats as $item)
                {{ $item->seat_name }}{{ !$loop->last ? ',' : '' }}
            @endforeach
        </span></p>
        </div>
        <hr style="border: 0; height: 3px; background-color: #333; margin: 15px 0;">
        <div>
            <p style="font-size: 14px; color: #555;"><span style="font-weight: bold;">Combo:</span></p>
            @foreach ($booking->combos as $combo)
                <p style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px; color: #555;"><span></span><span>{{ $combo->combo_name }} x {{ $combo->pivot->quantity }}</span></p>
            @endforeach
        </div>
        <hr style="border: 0; height: 3px; background-color: #333; margin: 15px 0;">
        <div style="font-size: 16px; font-weight: bold; text-align: right; margin-top: 10px;">
            Tổng cộng: {{ number_format($booking->amount) }}đ
        </div>
        <div style="margin-top: 20px; font-size: 14px; color: #555; text-align: center;">
            <p><strong>Thông tin rạp</strong></p>
            <p>FlickHive</p>
            <p>Địa Chỉ: {{$booking->showtime->room->cinema->cinema_address}}</p>
            <p>Phone: {{$booking->showtime->room->cinema->phone}}</p>
        </div>
    </div>
</body>
</html>
