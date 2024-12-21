<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quét mã vạch</title>
    <script src="https://unpkg.com/html5-qrcode/minified/html5-qrcode.min.js"></script>
    <style>
        #reader {
            width: 300px;
            margin: auto;
        }
    </style>
</head>
<body>
    <h1 style="text-align: center;">Quét mã vạch</h1>
    <div id="reader"></div>

    <script>
        // Kiểm tra hỗ trợ camera
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Trình duyệt của bạn không hỗ trợ camera hoặc quyền truy cập bị từ chối.");
        } else {
            const onScanSuccess = (decodedText) => {
                // Redirect đến trang chi tiết đơn hàng
                console.log(`Quét thành công: ${decodedText}`);
                window.location.href = `/admin/order/${decodedText}`;
            };

            const onScanFailure = (error) => {
                console.warn(`Quét thất bại: ${error}`);
            };

            const html5QrcodeScanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );

            html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        }
    </script>
</body>
</html>
