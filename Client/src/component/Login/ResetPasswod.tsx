import React, { useState } from 'react';
import axios from 'axios';
import './ForgetPass.css';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'antd';

import { z } from 'zod';
import { resetPasswordSchema } from '../../utils/validationSchema';

const ResetPassword = () => {
    const [formData, setFormData] = useState({ password: '', passwordConfirmation: '' });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | 'warning' | undefined>(undefined);
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate form data
        try {
            resetPasswordSchema.parse(formData);
        } catch (validationError) {
            if (validationError instanceof z.ZodError) {
                setMessage(validationError.errors[0]?.message || 'Dữ liệu không hợp lệ.');
                setMessageType('error');
            }
            return;
        }

        const email = localStorage.getItem('reset_email');
        if (!email) {
            setMessage('Không tìm thấy email trong phiên làm việc.');
            setMessageType('error');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/password/reset', {
                email,
                password: formData.password,
                password_confirmation: formData.passwordConfirmation,
            });

            setMessage('Mật khẩu đã được đặt lại thành công!');
            setMessageType('success');
            setShowAlert(true); // Hiển thị thông báo

            // Chuyển đến trang đăng nhập sau 2 giây
            setTimeout(() => {
                localStorage.removeItem('reset_email');
                navigate('/login');
            }, 2000);
        } catch (error) {
            setMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
            setMessageType('error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    return (
        <div className="forgot-password-container">
            <div className="form-section">
                <h2>Phục hồi mật khẩu</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="password">Mật khẩu mới</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Nhập mật khẩu mới"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <label htmlFor="passwordConfirmation">Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        id="passwordConfirmation"
                        placeholder="Xác nhận mật khẩu"
                        value={formData.passwordConfirmation}
                        onChange={handleChange}
                    />
                    <button type="submit">Đổi Mật Khẩu</button>
                </form>

                {message && (
                    <Alert
                        message={message}
                        type={messageType}
                        showIcon
                        style={{ marginTop: '15px' }}
                        afterClose={() => setShowAlert(false)}
                    />
                )}
            </div>
            <div className="image-section">
                <img src="https://cdn.moveek.com/bundles/ornweb/img/mascot.png" alt="Mascot" />
            </div>
        </div>
    );
};

export default ResetPassword;
