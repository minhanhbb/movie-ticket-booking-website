import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaChartLine,
  FaChevronRight,
  FaChevronDown,
  FaCogs,
  FaFilm,
  FaMoneyCheckAlt,
  FaGift,
  FaTags,
  FaUserShield,
  FaTheaterMasks,
  FaIndustry,
  FaChair,
  FaMedal,
  FaCalendarAlt,
  FaTag,
  FaTicketAlt,
  FaCreditCard,
  FaNewspaper,
  FaBullhorn,
  FaPlayCircle,
  FaBuilding,
  FaUserTie,
  FaVideo,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<{ [key: string]: boolean }>({});
  const [userRole, setUserRole] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    // Lấy thông tin từ localStorage
    const userData = JSON.parse(localStorage.getItem("user_profile") || "{}");
    const roles = userData.roles || [];

    // Lấy vai trò đầu tiên (nếu có)
    if (roles.length > 0) {
      setUserRole(roles[0].name); // Gán vai trò (ví dụ: "staff", "admin")
    }
  }, []);

  const toggleMenu = (menuKey: string) => {
    setOpenMenu((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    // Ngừng sự kiện lan truyền để không đóng menu
    e.stopPropagation();
  };
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Thay đổi trạng thái sidebar
  };

  return (
    <div className="container-wrapper">
      <div className="sidebar">
        <div className="header-logoo col-lg-1 col-md-4 col-sm-4 col-4 ">
          <Link to={""}>
            {" "}
            <span className="logo-first-letter1">F</span>lickHive
          </Link>
        </div>
        
        <ul>
          {(userRole === "manager" || userRole === "admin") && (
            <>
              <li>
                <NavLink
                  to={"/admin/dashboard"}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <FaTachometerAlt />
                  Bảng điều khiển
                </NavLink>
              </li>
            </>
          )}
          {(userRole === "manager" || userRole === "admin") && (
            <li>
              <span onClick={() => toggleMenu("cinema")}>
                <FaBuilding style={{ marginRight: "-80px" }} /> Hệ thống rạp{" "}
                {openMenu["cinema"] ? <FaChevronDown /> : <FaChevronRight />}
              </span>
              <ul className={openMenu["cinema"] ? "submenu open" : "submenu"}>
                <li>
                  <NavLink
                    to={"/admin/cinemas"}
                    onClick={handleLinkClick}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <FaTheaterMasks /> Quản lí rạp chiếu phim
                  </NavLink>
                </li>
                {(userRole === "manager") && (
                <li>
                  <NavLink
                    to={"/admin/rooms"}
                    onClick={handleLinkClick}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <FaIndustry /> Quản lí phòng rạp
                  </NavLink>
                </li>
                )}
                {(userRole === "manager") && (
                <li>
                  <NavLink
                    to={"/admin/seat-maps"}
                    onClick={handleLinkClick}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <FaChair />
                    Sơ đồ ghế
                  </NavLink>
                </li>
                )}
                {(userRole === "admin")  && (
                <li>
                  <NavLink
                    to={"/admin/rank"}
                    onClick={handleLinkClick}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <FaMedal />
                    Quản lí hạng
                  </NavLink>
                </li>
                )}
              </ul>
            </li>
          )}
          {userRole == "manager" && (
            <li>
              <span onClick={() => toggleMenu("movies")}>
                <FaPlayCircle /> Phim và suất chiếu{" "}
                {openMenu["movies"] ? <FaChevronDown /> : <FaChevronRight />}
              </span>
              <ul className={openMenu["movies"] ? "submenu open" : "submenu"}>
                <li>
                  <NavLink
                    to={"/admin/movies"}
                    onClick={handleLinkClick}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <FaFilm /> Quản lí phim
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"/admin/showtimes"}
                    onClick={handleLinkClick}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <FaCalendarAlt /> Quản lí xuất chiếu
                  </NavLink>
                </li>
                <li>
                <NavLink to={'/admin/actor'} className={({ isActive }) => (isActive ? 'active' : '')}>
                <FaUserTie /> Quản lí diễn viên</NavLink>
                </li>
                <li>
                <NavLink to={'/admin/director'} className={({ isActive }) => (isActive ? 'active' : '')}>
                <FaVideo/> Quản lí đạo diễn</NavLink>
                </li>
              </ul>
            </li>
          )}
          <li>
            {(userRole === "manager" || userRole === "staff" || userRole === "admin") && (
              <span onClick={() => toggleMenu("services")}>
                <FaGift style={{ marginRight: "-50px" }} /> Dịch vụ và ưu đãi{" "}
                {openMenu["services"] ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            )}
            <ul className={openMenu["services"] ? "submenu open" : "submenu"}>
              {/* Nếu userRole là "staff", chỉ hiển thị mục Quản lý đơn hàng */}
              {(userRole === "manager" || userRole === "staff") && (
                <li>
                  <NavLink
                    to={"/admin/orders"}
                    onClick={handleLinkClick}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <FaTag /> Quản lí đơn hàng
                  </NavLink>
                </li>
              )}
              <>
                {(userRole === "manager") && (
                  <li>
                    <NavLink
                      to={"/admin/combo"}
                      onClick={handleLinkClick}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <FaCogs /> Quản lí combo nước
                    </NavLink>
                  </li>
                )}
                {(userRole === "manager") && (
                  <li>
                    <NavLink
                      to={"/admin/promotions"}
                      onClick={handleLinkClick}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <FaTicketAlt /> Mã giảm giá
                    </NavLink>
                  </li>
                )}
                {userRole === "admin" && (
                  <li>
                    <NavLink
                      to={"/admin/method"}
                      onClick={handleLinkClick}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <FaCreditCard /> Phương thức thanh toán
                    </NavLink>
                  </li>
                )}
              </>
            </ul>
          </li>

          {userRole == "manager" && (
            <li>
              <span onClick={() => toggleMenu("content")}>
                <FaBullhorn style={{ marginRight: "-110px" }} /> Nội dung{" "}
                {openMenu["content"] ? <FaChevronDown /> : <FaChevronRight />}
              </span>
              <ul className={openMenu["content"] ? "submenu open" : "submenu"}>
                <li>
                  <NavLink
                    to={"/admin/posts"}
                    onClick={handleLinkClick}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <FaNewspaper /> Quản lí bài viết
                  </NavLink>
                </li>
              </ul>
            </li>
          )}
          {(userRole === "manager" || userRole === "admin") && (

            <li>
              <NavLink to="/admin/user">
                <FaUserShield /> Quản lý người dùng
              </NavLink>
            </li>
          )}
          {(userRole === "admin") && (
            <li>
              <NavLink to="/admin/website-settings">
                <FaCogs /> Cấu hình website
              </NavLink>
            </li>

          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;