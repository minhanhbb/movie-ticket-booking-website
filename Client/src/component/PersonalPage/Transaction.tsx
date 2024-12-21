import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, Avatar, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './Deposit.css'; // Import file CSS
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';
import './Transaction.css'
import { Link, useLocation } from 'react-router-dom';

const { Option } = Select;

const Transaction: React.FC = () => {
  const location = useLocation(); // Lấy vị trí hiện tại

  // Xác định URL hiện tại có thuộc nhóm "Tài khoản", "Nạp tiền", ...
  const isAccountActive = location.pathname === '/profile' || location.pathname === '/changepassword';
  const isCreditsActive = location.pathname === '/credits' || location.pathname === '/deponsit' || location.pathname === '/transaction';
    const [avatar, setAvatar] = useState('https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png'); // Khởi tạo giá trị avatar mặc định

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
 
  

  return (
    <>
      <Header/>
      <div className="banner">
          <img src="https://cdn.moveek.com/bundles/ornweb/img/tix-banner.png" alt="Banner" className="banner-img" />
        </div>
      <div className="content-acount">
      <div className="container boxcha">
      <div className="profile-fullscreen">
       
       <div className="account-settings-container">
       <div className="account-settings-container">
  <div className="account-avatar">
    <div className="account-info">
      <Avatar size={128} src={avatar} alt="avatar" className="avatar" />
      <div className="account-details">
        <h2 className="account-name">NPTG</h2>
        
      </div>
    </div>

    {/* Thêm menu điều hướng bên dưới avatar */}
    <div className="account-nav">
            <div className={`account-nav-item ${isAccountActive ? 'active' : ''}`}>
                <span className="account-nav-title">Tài khoản</span>
                <ul className="account-submenu">
                    <li className="account-submenu-item">
                        <Link to={'/profile'}>Quản lí tài khoản</Link>
                    </li>
                    <li className="account-submenu-item">
                        <Link to={'/changepassword'}>Đổi mật khẩu</Link>
                    </li>
                </ul>
            </div>

            <div className="account-nav-item">
                <span className="account-nav-title">Tủ phim</span>
            </div>

            <div className="account-nav-item">
                <span className="account-nav-title">Vé</span>
            </div>

            <div className={`account-nav-item ${isCreditsActive ? 'active' : ''}`}>
                <span className="account-nav-title">Nạp tiền</span>
                <ul className="account-submenu">
                    <li className="account-submenu-item">
                        <Link to={'/credits'}>Nạp tiền</Link>
                    </li>
                    <li className="account-submenu-item">
                        <Link to={'/deponsit'}>Lịch sử nạp tiền</Link>
                    </li>
                    <li className="account-submenu-item">
                        <Link to={'/transaction'}>Lịch sử giao dịch</Link>
                    </li>
                </ul>
            </div>
        </div>
  </div>
</div>
<div className="divider"></div> 
</div>
<div className="transaction-table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>THỜI GIAN</th>
            <th>MÔ TẢ</th>
            <th>SỐ TIỀN</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3} className="no-transaction">
              Bạn chưa có giao dịch Moveek Credits nào.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

      </div>
      </div>
      </div>
      
      <Footer />
    </>
  );
};  

export default Transaction;
