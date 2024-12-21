import React from "react";
import { Form, Input, Button, Upload, Avatar } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Footer from "../Footer/Footer";
import Header from "../Header/Hearder";
import { useUserContext } from "../../Context/UserContext";
import { NavLink } from "react-router-dom";

const Profile: React.FC = () => {
  const {
    userProfile,
    avatar,
    setUserProfile,
    handleUpdateProfile,
    handleAvatarUpload,
  } = useUserContext();

  // Kiểm tra xem userProfile có tồn tại hay không để tránh lỗi khi truy cập
  if (!userProfile) {
    return <div>Đang tải dữ liệu người dùng...</div>;
  }

  return (
    <>
      <Header />
      <div className="banner">
        <img
          src="https://cdn.moveek.com/bundles/ornweb/img/tix-banner.png"
          alt="Banner"
          className="banner-img"
        />
      </div>
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
          to="/ticketmovie" 
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

          <div className="divider"></div>
          <div className="profile-container">
            <Form
              layout="vertical"
              onFinish={handleUpdateProfile}
              className="profile-form"
            >
              <Form.Item label="Tên tài khoản">
                <Input value={userProfile?.user_name || ""} readOnly disabled />
              </Form.Item>
              <Form.Item label="Email">
                <Input value={userProfile?.email || ""} readOnly disabled />
              </Form.Item>
              <Form.Item label="Họ và tên">
                <Input
                  value={userProfile?.fullname || ""}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      fullname: e.target.value,
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="Số điện thoại">
                <Input
                  value={userProfile?.phone || ""}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      phone: e.target.value,
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="Ảnh đại diện">
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleAvatarUpload}
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
