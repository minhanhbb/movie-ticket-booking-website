import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    const handleViewOrder = () => {
        navigate(`/movieticket`);
    };

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className="payment-success-container">
            <div className="success-icon-wrapper">
                <div className="circle"></div>
                <CheckOutlined className="check-icon" />
            </div>
            <h1>Thanh toán thành công!</h1>
            <p>
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. <br />
                
            </p>
            <div className="button-group">
                <Button type="primary" onClick={handleViewOrder}>
                    Xem chi tiết đơn hàng
                </Button>
                <Button onClick={handleGoHome}>
                    Về trang chủ
                </Button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
