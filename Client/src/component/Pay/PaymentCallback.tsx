import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import instance from '../../server';

const PaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      // Giả sử VNPay trả về một số tham số qua query string
      const queryParams = new URLSearchParams(location.search);
      const vnp_ResponseCode = queryParams.get('vnp_ResponseCode');

      if (vnp_ResponseCode === '00') {
        // Thanh toán thành công
        const bookingData = localStorage.getItem('bookingData');
        if (bookingData) {
          try {
            const response = await instance.post('/book-ticket', JSON.parse(bookingData));
            // console.log('Đặt vé thành công:', response.data);

            // Xóa dữ liệu trong localStorage sau khi đặt vé thành công
            localStorage.removeItem('bookingData');

            // Điều hướng người dùng đến trang xác nhận
            navigate('/confirmation', { state: { success: true, bookingData: response.data } });
          } catch (error) {
            console.error('Đặt vé thất bại:', error);
            alert('Đặt vé thất bại. Vui lòng thử lại.');
          }
        }
      } else {
        // Thanh toán thất bại
        console.error('Thanh toán thất bại');
        alert('Thanh toán thất bại. Vui lòng thử lại.');
      }
    };

    checkPaymentStatus();
  }, [location, navigate]);

  return (
    <div>
      <h2>Đang xử lý thanh toán...</h2>
    </div>
  );
};

export default PaymentCallback;