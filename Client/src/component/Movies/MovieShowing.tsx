import React, { useState, useEffect } from 'react';
import "./MovieShowing.css";
import Footer from '../Footer/Footer';
import instance from "../../server";
import { Movie } from "../../interface/Movie";
import Header from '../Header/Hearder';
import { MovieCategory } from '../../interface/MovieCategory';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';  // Import the skeleton CSS

const MovieShowing: React.FC = () => {
  const [selectedPopular, setSelectedPopular] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<MovieCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    fetchGenres();
  }, []);

  // Hàm gọi API để lấy thể loại và phim
  const fetchGenres = async () => {
    try {
      const response = await instance.get("/movie-category");
      setGenres(response.data.data);

      // Tìm thể loại có nhiều phim nhất
      if (response.data.data.length > 0) {
        const mostPopularGenreId = response.data.data[0].id; // Giả sử thể loại đầu tiên là thể loại có nhiều phim nhất
        fetchMovies(mostPopularGenreId); // Gọi hàm fetchMovies với genreId
        setSelectedGenre(mostPopularGenreId); // Cập nhật trạng thái thể loại đã chọn
      }
    } catch (error) {
      console.error("Không thể tải thể loại phim:", error);
      setLoading(false);  // Set loading to false in case of error
    }
  };

  const fetchMovies = async (genreId: string) => {
    try {
      const response = await instance.get(`/movie/${genreId}`);
      if (response.data.status) {
        setMovies(response.data.data); // Cập nhật với dữ liệu từ API
      } else {
        console.error("Không tìm thấy phim:", response.data.message);
        setMovies([]); // Xóa danh sách phim nếu không tìm thấy
      }
    } catch (error) {
      console.error("Không thể tải phim:", error);
      setMovies([]); // Đảm bảo danh sách phim được xóa khi có lỗi
    } finally {
      setLoading(false); // Stop loading when data is fetched or error occurs
    }
  };

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const genreId = event.target.value;
    setSelectedGenre(genreId);
    if (genreId) {
      fetchMovies(genreId); // Gọi hàm fetchMovies với genreId
    } else {
      setMovies([]); // Xóa danh sách phim nếu không có thể loại nào được chọn
    }
  };

  return (
    <>
      <Header />
      <div className="banner">
        <h2>Phim đang chiếu</h2>
        <p>
          Danh sách các phim hiện đang chiếu rạp trên toàn quốc 24/10/2024. Xem lịch chiếu phim, giá vé tiện lợi, đặt vé nhanh chỉ với 1 bước!
        </p>
      </div>
      <div className="movie-showing">
        <div className="container">
          <div className="titleg">
            <div className="filters">
              <select value={selectedGenre} onChange={handleGenreChange} className="filter-select">
                <option value="">Thể loại</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="danh-sach-phim">
              {loading ? (
                // Display skeleton loaders horizontally
                <div className="movie-skeletons">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="phim-card skeleton-card">
                      <Skeleton height={200} width={150} />
                      <Skeleton width={120} />
                    </div>
                  ))}
                </div>
              ) : movies.length > 0 ? (
                movies.map((movie) => (
                  <div key={movie.id} className="phim-card">
                    <Link to={`/movie-detail/${movie.slug}`}>
                      <img src={movie.poster || "placeholder.jpg"} alt={movie.movie_name} className="phim-hinh" />
                    </Link>
                    <div className="phim-thong-tin">
                      <h3>
                        {movie.movie_name.length > 10 
                          ? `${movie.movie_name.slice(0, 20)}...` 
                          : movie.movie_name}
                      </h3>
                      <p>Khởi chiếu: {movie.release_date ? new Date(movie.release_date).toLocaleDateString("vi-VN") : "N/A"}</p>
                    </div>
                    {movie.release_date === '2024-10-25' && (
                      <div className="tag-chieu-som">Chiếu sớm</div>
                    )}
                  </div>
                ))
              ) : (
                <p>Không có phim nào cho thể loại này</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MovieShowing;
