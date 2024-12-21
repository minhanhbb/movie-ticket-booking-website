import React, { useEffect, useState } from 'react';
import './EarlyMovie.css';
import Header from '../Header/Hearder';
import Footer from '../Footer/Footer';
import instance from '../../server';
import { Modal } from 'antd';
import { Link } from 'react-router-dom';
import { stripHtml } from '../../assets/Font/quillConfig';
import MovieBanner from '../Banner/MovieBanner';
import Skeleton from 'react-loading-skeleton';  // Import skeleton loader
import 'react-loading-skeleton/dist/skeleton.css';  // Import skeleton CSS

const EarlyMovie: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [isTrailerVisible, setIsTrailerVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Thêm state loading

  useEffect(() => {
    // Gọi API để lấy danh sách phim chiếu sớm bằng instance
    instance
      .get('fillMovies/comingSoon')
      .then(response => {
        if (response.data.status) {
          setMovies(response.data.data.data); // Lưu danh sách phim vào state
        }
      })
      .catch(error => {
        console.error("Có lỗi khi lấy dữ liệu phim:", error);
      })
      .finally(() => {
        setLoading(false); // Kết thúc trạng thái loading
      });
  }, []); // Chạy 1 lần khi component được render

  const showTrailer = (movie: any) => {
    setSelectedMovie(movie); // Lưu phim được chọn vào state
    setIsTrailerVisible(true); // Hiển thị modal
  };

  return (
    <>
      <Header />
      <div className="movie-card-fullscreen">
        <div className="movie-card-header">
          <h2>Chiếu sớm</h2>
          <p>
            Danh sách các phim hiện đang chiếu rạp trên toàn quốc. Xem lịch chiếu phim, giá vé tiện lợi, đặt vé nhanh chỉ với 1 bước!
          </p>
        </div>
        
        {/* Kiểm tra trạng thái loading */}
        {loading ? (
          <div className="loading-content">
            <Skeleton height={300} width={200} />
            <Skeleton height={20} width={150} />
            <Skeleton height={50} count={3} />
          </div>
        ) : (
          <>
            {/* Kiểm tra nếu movies rỗng */}
            {movies.length === 0 ? (
              <>
                <p className="no-movies-message">Không có phim chiếu sớm nào.</p>
                <MovieBanner /> {/* Hiển thị MovieBanner khi không có phim */}
              </>
            ) : (
              movies.map(movie => (
                <div className="movie-card-content" key={movie.movie.id}>
                  <div className="movie-card-poster">
                    <img src={movie.movie.poster} alt={movie.movie.movie_name} />
                  </div>
                  <div className="movie-card-info">
                    <h3>{movie.movie.movie_name}</h3>
                    <p className="movie-genre">{movie.movie.movie_name} - Comedy, Action, Adventure</p>
                    <p className="movie-description">{stripHtml(movie.movie.description)}</p>
                    <div className="movie-details1">
                      <div className="movie-info1">
                        <span className="duration1">
                          <i className="fas fa-clock"></i> {movie.movie.duration} phút
                        </span>
                        <span className="rating1">
                          <i className="fas fa-user-plus"></i> {movie.movie.age_limit}
                        </span>
                      </div>
                      <div className="movie-dates1">
                        Khởi chiếu: {movie.movie.release_date} · Chiếu sớm: {movie.movie.showtimes[0]?.showtime_date}
                      </div>
                    </div>
                    <div className="movie-actions">
                      <button className="btn-info">
                        <Link to={`/movie-detail/${movie.movie.slug}`}>Thông tin phim</Link>
                      </button>
                      <button className="btn-trailer" onClick={() => showTrailer(movie)}>
                        Trailer
                      </button>
                      <Link to={`/buy-now/${movie.movie.slug}`} className="btn-buy">
                        Mua vé
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* Modal hiển thị Trailer */}
      {selectedMovie && (
        <Modal
          title={selectedMovie.movie.movie_name || "Trailer"} // Tiêu đề modal là tên phim
          open={isTrailerVisible}
          onCancel={() => setIsTrailerVisible(false)} // Đóng modal khi nhấn ngoài modal
          footer={null}
          centered
          className="custom-modal"
        >
          <iframe
            width="100%"
            height="340px"
            src={selectedMovie.movie.trailer || "https://youtu.be/eW4AM1539-g?si=LSsCYUB0CVCH04id"} // Video trailer từ phim được chọn
            title="Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "10px", border: "none" }}
          ></iframe>
        </Modal>
      )}

      <Footer />
    </>
  );
};

export default EarlyMovie;
