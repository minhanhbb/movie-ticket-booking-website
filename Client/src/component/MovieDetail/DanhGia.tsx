import React, { useEffect, useState } from "react";
import "./MovieDetail.css";
import Footer from "../Footer/Footer";
import MovieDetail from "./MovieDetail";
import { useMovieContext } from "../../Context/MoviesContext"; // Import useMovieContext từ Context
import instance from "../../server";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';  // Import tiếng Việt từ date-fns

// Skeleton Loading Component
const SkeletonLoading = () => (
  <div className="skeleton-rating-container">
    {[...Array(3)].map((_, index) => (
      <div className="skeleton-comment" key={index}>
        <div className="skeleton-avatar" />
        <div className="skeleton-text" />
        <div className="skeleton-meta" />
      </div>
    ))}
  </div>
);

const DanhGia: React.FC = () => {
  const { slug } = useParams(); // Sử dụng slug từ URL
  const { state } = useMovieContext(); // Lấy dữ liệu từ MovieContext
  const [ratings, setRatings] = useState<any[]>([]); // Lưu danh sách đánh giá
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Lỗi nếu có
  const [showAllRatings, setShowAllRatings] = useState<boolean>(false); // Trạng thái để hiển thị tất cả đánh giá

  const movie = state.movies.find((movie) => movie.slug === slug); // Tìm phim từ danh sách phim trong context

  useEffect(() => {
    if (movie?.id) {
      setLoading(true);  // Đặt trạng thái loading = true khi gọi API
      instance
        .get(`/ratings/${movie?.id}`) // Gọi API lấy danh sách đánh giá của phim
        .then((response) => {
          if (response.data.status) {
            setRatings(response.data.data); // Cập nhật danh sách đánh giá
          } else {
            setError("Không có đánh giá cho phim này."); // Thông báo khi không có đánh giá
          }
          setLoading(false); // Đặt trạng thái loading = false khi API đã trả về
        })
        .catch((error) => {
          setError(error.message); // Lỗi khi gọi API
          setLoading(false);
        });
    } else {
      setError("ID phim không tồn tại.");
      setLoading(false);
    }
  }, [movie?.id]); // Chạy lại khi movie.id thay đổi

  function formatTimeAgo(date: string) {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi }); // Định dạng thời gian đánh giá
  }

  const handleShowAllRatings = () => {
    setShowAllRatings(true); // Hiển thị tất cả đánh giá khi nhấn nút "Xem thêm"
  };

  return (
    <>
      <MovieDetail />
      <div className="community-section">
        <h3>Cộng đồng</h3>
        {loading ? (
          <SkeletonLoading /> // Hiển thị loading skeleton khi đang tải
        ) : error ? (
          <p>{error}</p> // Hiển thị lỗi nếu có
        ) : ratings.length > 0 ? (
          <>
            {/* Hiển thị các đánh giá, chỉ hiển thị 3 đánh giá đầu tiên nếu chưa nhấn "Xem thêm" */}
            {ratings.slice(0, showAllRatings ? ratings.length : 3).map((rating) => (
              <div className="comment" key={rating.id}>
                <p className="comment-user">
                  {/* <img
                    className="avatar-icon"
                    src={rating.user.avatar || "https://rapchieuphim.com/photos/36/poster/wall-phim-ong-trum.jpg"} // Thêm ảnh mặc định nếu không có avatar
                    alt={rating.user_name}
                  /> */}
                  <strong>{rating.user_name}</strong>
                  <span className="comment-rating">
                    ⭐ {rating.rating}
                  </span>{" "}
                  • {formatTimeAgo(rating.created_at)}
                </p>
                <p className="comment-text">
                  {rating.review || "Không có nội dung đánh giá."}
                </p>
              </div>
            ))}
            {/* Hiển thị nút "Xem thêm" nếu có nhiều hơn 3 đánh giá */}
            {ratings.length > 3 && !showAllRatings && (
              <button className="btn btn-secondary" onClick={handleShowAllRatings}>
                Xem thêm
              </button>
            )}
          </>
        ) : (
          <p>Chưa có đánh giá nào cho phim này.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default DanhGia;
