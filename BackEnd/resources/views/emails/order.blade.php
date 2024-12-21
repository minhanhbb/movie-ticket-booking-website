<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Confirmation</title>
    <link rel="stylesheet" href="EmailConfirm.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

        body {
            margin: 0;
            font-family: 'Poppins', sans-serif;
        }

        .email-confirm-container {
            background-color: #2e034c;
            color: #fff;
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .email-confirm-header {
            text-align: center;
            padding: 20px 0;
        }

        .email-confirm-event-title {
            color: #f64c93;
            font-size: 26px;
            font-weight: 600;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1.2px;
        }

        .email-confirm-confirmation-msg {
            font-size: 18px;
            font-weight: 400;
            margin-bottom: 10px;
            letter-spacing: 0.5px;
            color: #fff;
        }

        .email-confirm-ticket-icon {
            margin: 20px 0;
        }

        .email-confirm-ticket-icon img {
            width: 100px;
            margin-bottom: 10px;
        }

        .email-confirm-button-get-tickets {
            background-color: #ff7534;
            color: #fff;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease;
        }

        .email-confirm-button-get-tickets:hover {
            background-color: #e96526;
        }

        .email-confirm-event-details {
            background-color: #fff;
            color: #000;
            padding: 20px;
            border-radius: 3px;
            margin: 20px 0;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .email-confirm-event-image {
            width: 100%;
            height: auto;
            border-radius: 4px;
            margin-bottom: 15px;
            object-fit: cover;
        }

        /* Ticket info section */
        .email-confirm-ticket-info {
            display: block;
            /* Đặt chế độ hiển thị thành block */
            font-size: 18px;
            font-weight: bold;
            color: #fff;
            margin-bottom: 10px;
        }

        .email-confirm-ticket-info i {
            color: #e96526;
            margin-bottom: 5px;
            /* Thêm khoảng cách giữa icon và dòng text đầu tiên */
        }

        .email-confirm-ticket-info p {
            margin: 5px 0;
            /* Thay đổi khoảng cách giữa các thẻ p */
        }

        .order-total {
            font-size: 15px;
            color: #ccc;
            margin-top: 10px;
            /* Thêm khoảng cách trên order total */
        }

        /* Event time and location */
        .email-confirm-event-time-location {
            font-size: 16px;
            color: #fff;
            margin-bottom: 20px;
        }

        .event-time {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            color: #fff;
            font-weight: bold;
        }

        .event-time i {
            color: #e96526;
            margin-right: 10px;
        }

        .email-confirm-event-links {
            font-size: 14px;
            color: #fff;
            margin-top: 5px;
        }

        .email-confirm-event-links span {
            font-weight: bold;
            margin-right: 10px;
        }

        .email-confirm-event-links a {
            color: #ff7534;
            text-decoration: none;
            margin-right: 8px;
            font-weight: bold;
        }

        .email-confirm-event-links a:hover {
            text-decoration: underline;
        }

        .event-location {
            display: flex;
            align-items: center;
            font-size: 16px;
            margin-top: 10px;
            font-weight: bold;
            color: #fff;
        }

        .event-location i {
            color: #e96526;
            margin-right: 10px;
        }

        .organizer-section {
            text-align: center;
            font-size: 14px;
            font-weight: 600;
            margin-top: 20px;
            color: #fff;
        }

        .follow-button {
            background-color: #e96526;
            color: #fff;
            border: none;
            padding: 8px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
            transition: background-color 0.3s ease;
        }

        .follow-button:hover {
            background-color: #0056b3;
        }

        .contact-section {
            margin-top: 20px;
            font-size: 14px;
            text-align: center;
            color: #fff;
        }

        .contact-section a {
            color: #007bff;
            text-decoration: none;
        }

        .contact-section a:hover {
            text-decoration: underline;
        }

        /* Footer section */
        .email-confirm-footer {
            background-color: #2e034c;
            color: #fff;
            text-align: center;
            padding: 20px;
            border-radius: 8px;
        }

        .footer-brand {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #e96526;
        }

        .email-confirm-social-links {
            margin-bottom: 20px;
        }

        .email-confirm-social-links a {
            margin: 0 10px;
            display: inline-block;
        }

        .email-confirm-social-links img {
            width: 30px;
            height: 30px;
            vertical-align: middle;
        }

        .email-confirm-footer p {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 5px;
        }

        .email-confirm-order-summary {
            background-color: #fff;
            color: #000;
            padding: 20px;
            border-radius: 3px;
            margin: 20px 0;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }

        .email-confirm-order-summary h3 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .email-confirm-order-summary p {
            font-size: 16px;
            line-height: 1.6;
            font-weight: 400;
        }
    </style>
</head>

<body>
    <div class="email-confirm-container">
        <header class="email-confirm-header">
            <h1 class="email-confirm-event-title">FlickHive</h1>
            <p class="email-confirm-confirmation-msg">Trần Quang Huy, you're good to go</p>
            <div class="email-confirm-ticket-icon">
                <img src="https://img.icons8.com/?size=100&id=pwpz1tqVnCQy&format=png&color=000000" alt="ticket icon" />
                <p>Keep your tickets handy</p>
                <button class="email-confirm-button-get-tickets">Get the app</button>
            </div>
            <img class="barcode" src="{{ $booking->qrcode }}" alt="barcode">

        </header>
        <main class="email-confirm-event-details">
            <h2 class="email-confirm-event-title">{{ $booking->showtime->movieInCinema->movie['movie_name'] }}</h2>
            <img src="https://venngage-wordpress.s3.amazonaws.com/uploads/2021/10/Email-Banner-Travel-Offer.png"
                alt="event image" class="email-confirm-event-image" />
            <div class="email-confirm-ticket-info">
                <i class="fas fa-ticket-alt"></i>
                <p>{{ $booking->seats->count() }} x Ticket</p>
                <p>
                    Combo:
                    @foreach ($booking->combos as $combo)
                        {{ $combo->combo_name }} x {{ $combo->pivot->quantity }}{{ !$loop->last ? ', ' : '' }}
                    @endforeach
                </p>
                <p>
                    Ghế :
                    {{-- @foreach ($booking->seats as $item)
                        {{ $item['name'] }}{{ !$loop->last ? ', ' : '' }}
                    @endforeach --}}
                </p>
                <p class="order-total">Order total: {{ number_format($booking->amount) }} đ</p>
            </div>
            <div class="email-confirm-event-time-location">
                <p class="event-time">
                    <i class="far fa-calendar-alt"></i>
                    {{ $booking->created_at->format('l, F d, Y') }} from
                    {{ \Carbon\Carbon::parse($booking->showtime['showtime_start'])->format('H:i A') }} đến
                    {{ \Carbon\Carbon::parse($booking->showtime['showtime_end'])->format('H:i A') }} (CDT) (CDT)
                </p>
                <p class="email-confirm-event-links">
                    <span>Add to</span>
                    <a href="#">Google</a>
                    <a href="#">Outlook</a>
                    <a href="#">iCal</a>
                    <a href="#">Yahoo</a>
                </p>
                <p class="event-location">
                    <i class="fas fa-map-marker-alt"></i>
                    {{ $booking->showtime->movieInCinema->cinema->cinema_address }} <a href="#">(View on map)</a>
                </p>
            </div>
            <div class="email-confirm-event-links">
                <a href="#">View event details</a>
            </div>
            <div class="contact-section">
                <p>Questions about this event?</p>
                <a href="#">Contact the organizer</a>
            </div>
        </main>
        <section class="email-confirm-order-summary">
            <h3>Order Summary</h3>
            <p>Order: #{{ $booking->id }}</p>
            <p>Order placed: {{ $booking->created_at->format(' F d, Y') }}</p>
            <p>Order total: {{ number_format($booking->amount) }} đ</p>
            <p>Payment method: {{ $booking->payMethod->pay_method_name }}</p>
        </section>
        <footer class="email-confirm-footer">
            <p class="footer-brand">FlickHive</p>
            <div class="email-confirm-social-links">
                <a href="#" aria-label="Instagram">
                    <img src="https://img.icons8.com/?size=100&id=32292&format=png&color=ffffff" alt="Instagram" />
                </a>
                <a href="#" aria-label="Twitter">
                    <img src="https://img.icons8.com/?size=100&id=8824&format=png&color=ffffff" alt="Twitter" />
                </a>
                <a href="#" aria-label="Facebook">
                    <img src="https://img.icons8.com/?size=100&id=118468&format=png&color=ffffff" alt="Facebook" />
                </a>
            </div>
            <p>This email was sent to hello@SmilesDavis.yeah</p>
            <p>Eventbrite | 155 5th St, 7th Floor | San Francisco, CA 94103</p>
            <p>Copyright © 2018 Eventbrite. All rights reserved.</p>
        </footer>
    </div>
</body>

</html>
