import React, { useState } from 'react';
import { Avatar, Input, notification } from 'antd';
import { z } from 'zod';  // Import zod
import './ChangePassword.css';
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';
import { NavLink } from 'react-router-dom';
import instance from '../../server';
import { passwordSchema } from '../../utils/validationSchema';
import { useUserContext } from '../../Context/UserContext';


const ChangePassword: React.FC = () => {
  const { userProfile, avatar } = useUserContext(); // Access userProfile and avatar from context
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate form with Zod schema
    try {
      passwordSchema.parse({ currentPassword, newPassword, confirmPassword });

      // If valid, submit the form
      try {
        const response = await instance.post('/resetPassword', {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        });

        if (response.data.message) {
          notification.success({ message: 'Đổi mật khẩu thành công!' });
        } else {
          notification.error({ message: response.data.message || 'Cập nhật mật khẩu thất bại' });
        }
      } catch (error: any) {
        if (error.response?.status === 400) {
          notification.error({ message: 'Mật khẩu hiện tại không chính xác.' });
        } else {
          notification.error({ message: error.response?.data?.message || 'Cập nhật mật khẩu thất bại' });
        }
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      // Handle validation errors
      const zodErrors = e.errors.reduce((acc: any, error: any) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {});
      setErrors(zodErrors); 
    }
  };

  return (
    <>
      <Header />
      <div className="banner">
        <img src="https://cdn.moveek.com/bundles/ornweb/img/tix-banner.png" alt="Banner" className="banner-img" />
      </div>
      <div className="container">
        <div className="content-acount1">
          <div className="container boxcha">
            <div className="profile-fullscreen">
              <div className="account-settings-container">
                <div className="account-avatar">
                  <div className="account-info fix-acount">
                    <Avatar size={128} src={avatar} alt="avatar" className="avatar" />
                    <div className="account-details">
                      <h2 className="account-name">
                        {userProfile?.user_name || "No name"}
                      </h2>
                    </div>
                  </div>

                  <div className="account-nav">
                    <div className="account-nav-item">
                      <span className="account-nav-title">
                        <NavLink to="/profile" className={({ isActive }) => isActive ? 'active-link' : ''}>Tài khoản</NavLink>
                      </span>
                    </div>
                    <div className="account-nav-item">
                      <span className="account-nav-title">
                        <NavLink to="/movies" className={({ isActive }) => isActive ? 'active-link' : ''}>Tủ phim</NavLink>
                      </span>
                    </div>
                    <div className="account-nav-item">
                      <span className="account-nav-title">
                        <NavLink to="/ticketcinema" className={({ isActive }) => isActive ? 'active-link' : ''}>Vé</NavLink>
                      </span>
                    </div>
                    <div className="account-nav-item">
                      <span className="account-nav-title">
                        <NavLink to="/changepassword" className={({ isActive }) => isActive ? 'active-link' : ''}>Đổi mật khẩu</NavLink>
                      </span>
                    </div>
                    <div className="account-nav-item">
    <span className="account-nav-title">
      <NavLink 
        to="/Pointaccumulation" 
        className={({ isActive }) => isActive ? 'active-link' : ''}>
        Tích Điểm
      </NavLink>
    </span>
  </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="divider"></div>

            <div className="change-password-container">
              <form className="change-password-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Mật khẩu hiện tại:</label>
                  <Input.Password
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  {errors.currentPassword && <div className="error-message">{errors.currentPassword}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">Mật khẩu mới:</label>
                  <Input.Password
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {errors.newPassword && <div className="error-message">{errors.newPassword}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Xác minh:</label>
                  <Input.Password
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                </div>

                <button type="submit" className="submit-button">
                  Đổi mật khẩu
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChangePassword;
