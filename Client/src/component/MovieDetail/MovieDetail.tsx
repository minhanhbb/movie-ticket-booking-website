import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { notification, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { stripHtml } from '../../assets/Font/quillConfig';
import "./MovieDetail.css";
import Header from "../Header/Hearder";
import { useMovieContext } from "../../Context/MoviesContext";
import instance from "../../server";
import { format } from 'date-fns';
const MovieDetail: React.FC = () => {
  const { slug } = useParams(); // Sử dụng slug
  const location = useLocation();
  const { state, fetchMovies } = useMovieContext();
  const [userStatus, setUserStatus] = useState({
    isLoggedIn: false,
    isFavorite: false,
    isRated: false,
    favoriteMovies: [] as any[],
  });
  const [ratingData, setRatingData] = useState({
    rating: 0,
    review: "",
    isModalVisible: false,
  });
  const [isTrailerVisible, setIsTrailerVisible] = useState(false);

  // Tìm phim dựa trên slug thay vì id
  const movie = state.movies.find((movie) => movie.slug === slug);

  useEffect(() => {
    fetchMovies(); // Gọi lại fetchMovies khi slug thay đổi

    const fetchUserStatus = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Lấy danh sách phim yêu thích của người dùng
          const response = await instance.get("/user", {
       
         
          });
          

          // Kiểm tra xem phim hiện tại có trong danh sách yêu thích không
          const isFavorite = response.data.favorite_movies.some((favMovie: any) => favMovie.id === movie?.id);
// console.log("trang thai phim:",isFavorite);

          // Cập nhật trạng thái yêu thích
          setUserStatus((prev) => ({
            ...prev,
            isLoggedIn: true,
            isFavorite,
            favoriteMovies: response.data,
          }));
        } catch (error) {
          console.error("Error fetching user favorites:", error);
        }
      }
    };

    fetchUserStatus();
  }, [slug]);
 

 
  const handleFavoriteToggle = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      notification.warning({
        message: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để thêm phim vào danh sách yêu thích!",
      });
      return;
    }
  
    try {
      if (userStatus.isFavorite) {
        // Nếu phim đã được yêu thích, gọi API để xóa khỏi danh sách yêu thích
        const response = await instance.delete(`/favorites/${movie?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Kiểm tra nếu xóa thành công
        if (response.status === 200) {
          notification.success({
            message: "Thành công",
            description: "Phim đã được xóa khỏi danh sách yêu thích!",
          });
          // console.log("Movie ID to be deleted:", movie?.id);
        } else {
          notification.error({
            message: "Lỗi",
            description: "Có lỗi xảy ra khi xóa phim khỏi danh sách yêu thích.",
          });
        }
      } else {
        // Nếu phim chưa được yêu thích, gọi API để thêm vào danh sách yêu thích
        const response = await instance.post(`/favorites/${movie?.id}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Kiểm tra nếu thêm thành công
        if (response.status === 200) {
          notification.success({
            message: "Thành công",
            description: "Phim đã được thêm vào danh sách yêu thích!",
          });
        } else {
          notification.error({
            message: "Lỗi",
            description: "Có lỗi xảy ra khi thêm phim vào danh sách yêu thích.",
          });
        }
      }
  
      // Cập nhật trạng thái yêu thích sau khi thực hiện thành công
      setUserStatus((prev) => ({
        ...prev,
        isFavorite: !prev.isFavorite, // Đổi trạng thái yêu thích
      }));
    } catch (error) {
      console.error("Error when toggling favorite:", error);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi xử lý yêu thích phim.",
      });
    }
  };
  
  
  

  const handleRatingSubmit = async () => {
    if (!userStatus.isLoggedIn) {
      notification.warning({
        message: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để đánh giá phim!",
      });
      return;
    }

    try {
      await instance.post("/ratings", {
        movie_id: movie?.id,
        rating: ratingData.rating,
        review: ratingData.review,
      });
      notification.success({
        message: "Thành công",
        description: "Cảm ơn bạn đã để lại đánh giá!",
      });
      setRatingData({ rating: 0, review: "", isModalVisible: false });
      setUserStatus((prev) => ({ ...prev, isRated: true }));
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi gửi đánh giá.",
      });
    }
  };

  return (
    <>
      <Header />
      <div className="movie-detail-container">
        <div
          className="boxbig"
          style={{
            backgroundImage: `url(${movie?.poster || "https://example.com/default-image.jpg"})`,
          }}
        >
          <div className="info-section">
            <img src={movie?.poster || "placeholder.jpg"} alt={movie?.movie_name} className="poster" />
            <div className="movie-details-wrapper">
              <div className="movie-info-1">
                <h2 className="title">{movie?.movie_name}</h2>
                <p className="genre">
                  Thể loại: {movie?.movie_category?.map((cat: any) => cat.category_name).join(", ") || "Không có thể loại"}
                </p>

             <div className="actions-1 row row-cols-2 row-cols-md-4 g-3">
  {/* Thích */}
  <div className="col text-center">
    <button className="btn btn-outline-danger w-100" onClick={handleFavoriteToggle}>
      {userStatus.isFavorite ? "❤️" : "🤍"} <span>Thích</span>
    </button>
  </div>

  {/* Đánh giá */}
  <div className="col text-center">
    <button className="btn btn-outline-warning w-100" onClick={() => setRatingData((prev) => ({ ...prev, isModalVisible: true }))}>
      <FontAwesomeIcon icon={faStar} color={userStatus.isRated ? "#FFD700" : "#ccc"} />
      <span className="danhgia"> Đánh giá </span>
    </button>
  </div>

  {/* Trailer */}
  <div className="col text-center">
    <button className="btn btn-outline-primary w-100" onClick={() => setIsTrailerVisible(true)}>
      Trailer
    </button>
  </div>

  {/* Mua vé */}
  <div className="col text-center">
    <Link to={`/buy-now/${slug}`} className="btn btn-outline-success w-100">
      Mua vé
    </Link>
  </div>
</div>


                <p className="description">{stripHtml(movie?.description || "Không có mô tả")}</p>

                <div className="movie-details">
                  <div>📅 Khởi chiếu: {movie?.release_date ? format(new Date(movie.release_date), 'dd/MM/yyyy') : 'Chưa có ngày phát hành'}</div>
                  <div>⏰ Thời lượng: {movie?.duration || "Chưa có thời lượng"} phút</div>
                  <div>🔞 Giới hạn tuổi: {movie?.age_limit ? `${movie.age_limit}` : "Không có giới hạn tuổi"}</div>
                </div>
              </div>

              <div className="additional-info">
                <strong>Diễn viên:</strong>
                <p>{movie?.actor?.map((actor: any) => actor.actor_name).join(", ") || "Không có diễn viên"}</p>

                <strong>Đạo diễn:</strong>
                <p>{movie?.director?.map((director: any) => director.director_name).join(", ") || "Không có đạo diễn"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="tabs">
            <Link to={`/movie-detail/${slug}`} className={`tab ${location.pathname === `/movie-detail/${slug}` ? "active" : ""}`}>
              Thông tin phim
            </Link>
            <Link to={`/schedule/${slug}`} className={`tab ${location.pathname === `/schedule/${slug}` ? "active" : ""}`}>
              Lịch chiếu
            </Link>
            <Link to={`/reviews/${slug}`} className={`tab ${location.pathname === `/reviews/${slug}` ? "active" : ""}`}>
              Đánh giá
            </Link>
            <Link to={`/news/${slug}`} className={`tab ${location.pathname === `/news/${slug}` ? "active" : ""}`}>
              Tin tức
            </Link>
            <Link to={`/buy-now/${slug}`} className={`tab ${location.pathname === `/buy-now/${slug}` ? "active" : ""}`}>
              Mua vé
            </Link>
          </div>
      </div>

      {/* Modal Đánh Giá */}
      <Modal title="Đánh giá phim" open={ratingData.isModalVisible} onOk={handleRatingSubmit} onCancel={() => setRatingData({ ...ratingData, isModalVisible: false })}>
        <div className="danhgiaphim">
          <div className="imgphim">
            <img src={movie?.poster || "placeholder.jpg"} alt={movie?.movie_name} />
          </div>
          <div className="noidungdanhgia">
            <p>Hãy để lại đánh giá của bạn cho phim {movie?.movie_name}!</p>
            <div className="rating">
              {[...Array(10).keys()].map((i) => (
                <FontAwesomeIcon key={i} icon={faStar} color={i < ratingData.rating ? "#FFD700" : "#ccc"} onClick={() => setRatingData((prev) => ({ ...prev, rating: i + 1 }))} style={{ cursor: "pointer" }} />
              ))}
            </div>
            <textarea value={ratingData.review} onChange={(e) => setRatingData((prev) => ({ ...prev, review: e.target.value }))} />
          </div>
        </div>
      </Modal>


    
      <Modal
  title={movie?.movie_name}  // Ẩn tiêu đề nếu không cần
  open={isTrailerVisible}
  onCancel={() => setIsTrailerVisible(false)}
  footer={null}
  centered // Modal xuất hiện giữa màn hình
  className="custom-modal"
>
  {movie?.trailer ? (
    <iframe
   
      width="100%"
      height="390px"
      src={movie.trailer}
      title="Trailer"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      style={{ borderRadius: "10px", border: "none" }} // Tùy chỉnh giao diện iframe
    ></iframe>
  ) : (
    <div className="no-trailer">
      <p>Trailer không khả dụng</p>
    </div>
  )}
</Modal>


    </>
  );
};

export default MovieDetail;
