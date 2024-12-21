import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ForgetPass.css';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'antd';

const Otp = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState(''); // Get email from localStorage
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | 'warning' | undefined>(undefined);
    const nav = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    useEffect(() => {
        const storedEmail = localStorage.getItem('reset_email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Ensure OTP is not empty before submitting
        if (!otp.trim()) {
            setMessage('Vui lòng nhập OTP.');
            setMessageType('error');
            return;
        }

        try {
            // Send OTP and email to the backend to verify
            await axios.post('http://127.0.0.1:8000/api/password/verify-otp', {
                otp,
                email,
            });

            setMessage('OTP hợp lệ! Bạn có thể tiếp tục.');
            setMessageType('success');
            setShowAlert(true); // Hiển thị thông báo
            setTimeout(() => nav('/resetPassword'), 2000);
        } catch (error) {
            setMessage('OTP không hợp lệ. Vui lòng thử lại.');
            setMessageType('error');
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="form-section">
                <h2>Phục hồi mật khẩu</h2>
                <form onSubmit={handleVerifyOtp}>
                    <label htmlFor="otp">OTP</label>
                    <input
                        type="text"
                        id="otp"
                        placeholder="Nhập OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      
                    />
                    <button type="submit">Xác minh OTP</button>
                </form>
                
                {message && (
                    <Alert
                        message={message}
                        type={messageType} // Use messageType for success or error
                        showIcon
                        style={{ marginTop: '15px' }}
                    />
                )}
            </div>
            <div className="image-section">
                <img src="https://cdn.moveek.com/bundles/ornweb/img/mascot.png" alt="Mascot" />
            </div>
        </div>
    );
};

export default Otp;
