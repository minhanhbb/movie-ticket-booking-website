import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Avatar,
  notification,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./Deposit.css"; // Import file CSS
import Footer from "../Footer/Footer";
import Header from "../Header/Hearder";
import "./Profile.css";
import { Link } from "react-router-dom";
import instance from "../../server";

const { Option } = Select;

const Deponsit: React.FC = () => {
  const [avatar, setAvatar] = useState(
    "https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png"
  );
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const profileData = localStorage.getItem("user_profile");
    if (profileData) {
      const profile = JSON.parse(profileData);
      const userId = profile.id;

      // Lấy thông tin người dùng theo ID
      const fetchUserProfile = async () => {
        try {
          const response = await instance.get(`/user/${userId}`);
          if (response.data.status) {
            const userProfileData = response.data.data;
            setUserProfile(userProfileData);
            setAvatar(
              userProfileData.avatar ||
                "https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png"
            );
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserProfile();
    }
  }, []);

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
                        {userProfile?.fullname || "No name"}
                      </h2>
                    </div>
                  </div>

                  {/* Thêm menu điều hướng bên dưới avatar */}
                  <div className="account-nav">
                    <div className="account-nav-item">
                      <span className="account-nav-title">Tài khoản</span>
                      <ul className="account-submenu">
                        <li className="account-submenu-item">
                          <Link to={"/profile"}>Quản lí tài khoản</Link>
                        </li>
                        <li className="account-submenu-item">
                          <Link to={"/changepassword"}>Đổi mật khẩu</Link>
                        </li>
                      </ul>
                    </div>
                    <div className="account-nav-item">
                      <span className="account-nav-title">Tủ phim</span>
                    </div>
                    <div className="account-nav-item">
                      <span className="account-nav-title">Vé</span>
                    </div>
                    <div className="account-nav-item">
                      <span className="account-nav-title">Nạp tiền</span>
                      <ul className="account-submenu">
                        <li className="account-submenu-item">Nạp tiền</li>
                        <li className="account-submenu-item">
                          Lịch sử nạp tiền
                        </li>
                        <li className="account-submenu-item">
                          <Link to={"/transaction"}>Lịch sử giao dịch</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="divider"></div>
            </div>
            <div className="transaction-table-wrapper">
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>THỜI GIAN</th>
                    <th>HÌNH THỨC</th>
                    <th>SỐ TIỀN</th>
                    <th>TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="transaction-empty">
                      Bạn chưa có giao dịch nạp tiền nào. Nhấn vào{" "}
                      <a href="#">đây</a> để nạp.
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

export default Deponsit;
