<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scan Barcode and Display Ticket</title>
    <style>
        #scanner-container {
            position: relative;
            width: 100%;
            height: 500px;
            border: 1px solid #ccc;
        }

        video {
            width: 100%;
            height: 100%;
            border: 1px solid #ccc;
        }

        #ticket {
            margin-top: 20px;
        }
    </style>
</head>
<body>

    <h1>Scan Your Ticket Barcode</h1>

    <div id="scanner-container">
        <video id="scanner-video" width="100%" height="100%"></video>
    </div>

    <div id="ticket">
        <!-- This section will show the booking ticket details after scanning -->
    </div>

    <script>
        // Initialize Quagga to open the camera and scan barcode
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#scanner-video'),
                constraints: {
                    facingMode: "environment"
                }
            },
            decoder: {
                readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "upc_reader"]
            }
        }, function(err) {
            if (err) {
                console.log("Error initializing Quagga: ", err);
                return;
            }
            Quagga.start();
        });

        // Listen for barcode detection event
        Quagga.onDetected(function(result) {
            const barcode = result.codeResult.code;
            console.log("Barcode Detected: ", barcode);

            // Call API to get booking information using the barcode (which is booking ID)
            fetchBookingDetails(barcode);
        });

        // Fetch booking details based on the barcode
        function fetchBookingDetails(barcode) {
            fetch(`/api/booking/${barcode}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Display booking information
                        displayTicket(data.booking);
                    } else {
                        alert('Booking not found!');
                    }
                })
                .catch(error => {
                    console.error('Error fetching booking details:', error);
                    alert('There was an error fetching your booking details.');
                });
        }

        // Function to display booking details in the UI
        function displayTicket(booking) {
            const ticketContainer = document.getElementById('ticket');
            ticketContainer.innerHTML = `
                <h2>Your Ticket Details</h2>
                <p><strong>Booking ID:</strong> ${booking.id}</p>
                <p><strong>Movie:</strong> ${booking.movie_name}</p>
                <p><strong>Showtime:</strong> ${booking.showtime}</p>
                <p><strong>Seats:</strong> ${booking.seats.join(', ')}</p>
                <p><strong>Total:</strong> ${booking.amount} đ</p>
            `;
        }
    </script>

</body>
</html>
