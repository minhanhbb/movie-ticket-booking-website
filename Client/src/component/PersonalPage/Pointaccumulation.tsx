import React, { useState, useEffect } from "react";
import { Card, Row, Col, Input, Table, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { NavLink } from "react-router-dom";
import './Pointaccumulation.css';
import { useUserContext } from "../../Context/UserContext";
import Header from "../Header/Hearder";


const Pointaccumulation: React.FC = () => {
  
  const { userProfile, avatar, setUserProfile } = useUserContext(); // Use context to get user data
  const [searchTerm, setSearchTerm] = useState("");
  const [pointHistories, setPointHistories] = useState<any[]>([]);
  
  useEffect(() => {
    if (userProfile) {
      setPointHistories(userProfile.point_histories);
    }
  }, [userProfile]);

  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value);
  };



  const totalAmount = userProfile?.total_amount || 0;
  const maxAmount = 5000000; // Giới hạn của Diamond level, có thể thay đổi theo nhu cầu
  const progressPercentage = Math.min((totalAmount / maxAmount) * 100, 100); // Tính tỷ lệ phần trăm
  const [selectedItems, setSelectedItems] = useState(10); // Mặc định hiển thị 10 mục

const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setSelectedItems(parseInt(e.target.value));
};

const filteredTransactions = pointHistories
  .filter((transaction) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.created_at.toLowerCase().includes(searchLower) ||
      transaction.status.toLowerCase().includes(searchLower) ||
      (transaction.points_earned?.toString().includes(searchLower) || "") ||
      (transaction.points_used?.toString().includes(searchLower) || "")
    );
  })
  .slice(0, selectedItems); // Giới hạn số lượng mục hiển thị // Giới hạn số lượng mục hiển thị

 

  return (
    <>
      <Header />
      
      {/* Banner Section */}
      <div className="banner">
        <img
          src="https://cdn.moveek.com/bundles/ornweb/img/tix-banner.png"
          alt="Banner"
          className="banner-img"
        />
      </div>

      {/* Profile and Account Info Section */}
      <div className="content-acount">
        <div className="container boxcha">
          <div className="profile-fullscreen">
            <div className="account-settings-container">
              <div className="account-avatar">
                <div className="account-info">
                  <Avatar
                    size={128}
                    src={avatar}
                    alt="avatar"
                    className="avatar"
                  />
                  <div className="account-details">
                    <h2 className="account-name">
                      {userProfile?.user_name || "Đang cập nhật thông tin"}
                    </h2>
                  </div>
                </div>
                {/* Menu điều hướng bên dưới avatar */}
                <div className="account-nav">
  <div className="account-nav-item">
    <span className="account-nav-title">
      <NavLink 
        to="/profile" 
        className={({ isActive }) => isActive ? 'active-link' : ''}>
        Tài khoản
      </NavLink>
    </span>
  </div>
  <div className="account-nav-item">
    <span className="account-nav-title">
      <NavLink 
        to="/Personal" 
        className={({ isActive }) => isActive ? 'active-link' : ''}>
        Tủ phim
      </NavLink>
    </span>
  </div>
  <div className="account-nav-item">
    <span className="account-nav-title">
      <NavLink 
        to="/ticketcinema" 
        className={({ isActive }) => isActive ? 'active-link' : ''}>
        Vé
      </NavLink>
    </span>
  </div>
  <div className="account-nav-item">
    <span className="account-nav-title">
      <NavLink 
        to="/changepassword" 
        className={({ isActive }) => isActive ? 'active-link' : ''}>
        Đổi mật khẩu
      </NavLink>
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

          <div className="divider"></div> {/* Thêm divider */}

          <div className="points-container">
            {/* Phần tóm tắt điểm và cấp độ thành viên */}
            <div className="points-summary">
              <div className="points-header">
                <h3>Số tiền đã chi tiêu</h3>
                <span className="total-amount">{totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>

              </div>
              <div className="points-bar">
                <div
                  className="progress-bar"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="membership-levels">
                <span>Thành Viên: 0 VND</span>
                <span>Bạc: 200.000 VND</span>
                <span>Vàng: 500.000 VND</span>
                <span>Bạch Kim: 1.500.000 VND</span>
                <span>Kim Cương: 3.000.000 VND</span>
              </div>
              <div className="points-details">
                <p><strong>Điểm tích lũy:</strong>{userProfile?.points || "0"}  điểm</p>
            
                <p><strong>Cấp hạng:</strong> {userProfile?.rank_name || "Gold Member"}</p>
              </div>
            </div>

            {/* Phần lịch sử điểm */}
            <div className="points-history">
              <h3>Lịch sử điểm</h3>
              <div className="history-header">
              <label>
  Hiển thị
  <select onChange={handleSelectChange} value={selectedItems}>
    <option value="10">10</option>
    <option value="20">20</option>
    <option value="50">50</option>
  </select>
  mục
</label>

                
              </div>

              <Table
                dataSource={filteredTransactions}
                rowKey="id"
                columns={[
                  { title: "Thời gian", dataIndex: "created_at", render: (text: string) => new Date(text).toLocaleString() },
                  {
                    title: "Số điểm cộng",
                    dataIndex: "points_earned",
                    render: (points: number) => `+${points}`, // Thêm dấu cộng trước số điểm
                  },
                  
                  { title: "Số điểm tiêu", dataIndex: "points_used" , render: (points: number) => `-${points}`, },
                  { title: "Trạng thái", dataIndex: "type" },
                ]}
                pagination={false}
                bordered
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pointaccumulation;
