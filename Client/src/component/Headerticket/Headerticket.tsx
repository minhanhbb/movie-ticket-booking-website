import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import feather from 'feather-icons';
import './Headerticket.css';

const Headerticket = () => {
    const location = useLocation();

    useEffect(() => {
        feather.replace();

        // Thay đổi màu của các icon bằng cách đặt thuộc tính 'stroke'
        document.querySelectorAll('.buoc.active i svg').forEach((icon) => {
            (icon as SVGElement).style.stroke = '#FF5252'; // Màu đỏ cho icon hoạt động
        });
    }, [location]); // Chạy lại khi URL thay đổi

    const getActiveClass = (path: string): string => {
        return location.pathname.includes(path) ? 'active' : '';
    };

    return (
        <div className="thanh-tien-trinh">
            <div className={`buoc ${getActiveClass('/seat')}`}>
                <i data-feather="grid"></i>
                <span className="label">Chọn ghế</span>
            </div>

            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 4L16 12L8 20" stroke="#b0c4de" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>


            <div className={`buoc ${getActiveClass('/orders')}`}>
                <i data-feather="shopping-bag"></i>
                <span className="label">Bắp nước</span>
            </div>

            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 4L16 12L8 20" stroke="#b0c4de" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

            <div className={`buoc ${getActiveClass('/pay')}`}>
                <i data-feather="credit-card"></i>
                <span className="label">Thanh toán</span>
            </div>

            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 4L16 12L8 20" stroke="#b0c4de" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

            <div className="buoc">
                <i data-feather="inbox"></i>
                <span className="label">Thông tin vé</span>
            </div>
        </div>
    );
};

export default Headerticket;
