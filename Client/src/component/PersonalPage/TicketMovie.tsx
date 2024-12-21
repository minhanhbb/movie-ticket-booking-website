import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Avatar, notification } from "antd";
import { LikeOutlined, UploadOutlined } from "@ant-design/icons";
import Footer from "../Footer/Footer";
import Header from "../Header/Hearder";
import { useUserContext } from "../../Context/UserContext";
import { Link, NavLink } from "react-router-dom";
import { Movie } from "../../interface/Movie";
import { formatDistanceToNow } from "date-fns";

const TicketMovie: React.FC = () => {
  
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [activities, setActivities] = useState<string[]>([]); // Store recent activities
  const [visibleActivities, setVisibleActivities] = useState<string[]>([]); // Activities to show
  const [showAllActivities, setShowAllActivities] = useState(false); // Show all activities state

  useEffect(() => {
    if (userProfile) {
      const movies = userProfile.favorite_movies || [];
      setFavoriteMovies(movies);

      // Add favorite movie activities to the activity list
      const newActivities = movies.map((movie: Movie) => {
        const timeAgo = formatDistanceToNow(new Date(movie.created_at), { addSuffix: true });
        return `${userProfile.user_name} đã yêu thích phim: ${movie.movie_name} - ${timeAgo}`;
      });
      setActivities(newActivities);
      setVisibleActivities(newActivities.slice(0, 3)); // Display the first 3 activities
    }
  }, );

  const handleSeeMore = () => {
    setShowAllActivities(true);
    setVisibleActivities(activities); // Show all activities
  };
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
        to="/point" 
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
          <div className='phimyeuthich-container'>
              <div className="phimyeuthich ">
                {favoriteMovies.length > 0 ? (
                  favoriteMovies.map((movie) => {
                    return (
                      <div className="item-phim " key={movie.id}>
                       <div className="img">
           <Link to={`/movie-detail/${movie.slug}`}> <img src={movie.poster || undefined} alt={movie.movie_name} /></Link>
          </div>
            
          <span className="rating-2">
<LikeOutlined  className="icon-likee-2"
    style={{
    position:"relative",
    right:"5px",    
      color: "#28a745",           
      background: "none",        
      fontSize: "16px"            
    }} 
  />
  {typeof movie.rating === 'number' ? (movie.rating * 10).toFixed(0) : 0}%
</span>   
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12 text-center">Chưa có phim yêu thích nào.</div>
                )}
              </div>
            </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TicketMovie;
