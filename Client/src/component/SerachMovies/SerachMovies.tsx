import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"; // Lấy movie_name từ URL
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import "./SerachMovies.css";

import instance from "../../server"; // Sử dụng instance từ server
import { Movie } from "../../interface/Movie";
import MovieBanner from "../Banner/MovieBanner";

const SearchMovies = () => {
  const { movie_name } = useParams(); // Lấy tên phim từ URL
  const [movies, setMovies] = useState<Movie[]>([]); // State lưu danh sách phim
  const [loading, setLoading] = useState<boolean>(true); // State lưu trạng thái loading
  const [error, setError] = useState<string | null>(null); // State lưu lỗi

  useEffect(() => {
    // Reset state khi movie_name thay đổi
    setMovies([]);
    setError(null);
    setLoading(true);

    // Gọi API tìm kiếm phim
    instance
      .get(`/movie/search/${movie_name}`)
      .then((response) => {
        setMovies(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi tìm kiếm phim:", error);
        
        setLoading(false);
      });
  }, [movie_name]); // movie_name thay đổi sẽ gọi lại useEffect

  return (
    <>
      <Header />
      <div className="Contentseach">
        <div className="banner-movies">
          <h2>Tìm Kiếm</h2>
          <div className="text-white mt-0 description">
            Theo từ khóa '{movie_name}'
          </div>
        </div>
        <div className="container">
          {/* Loading Indicator */}
          {loading && <div className="loading">Đang tìm kiếm...</div>}

          {/* Hiển thị lỗi nếu có */}
          {error && <div className="error-message">{error}</div>}

          {/* Hiển thị kết quả tìm kiếm */}
          {!loading && !error && (
            <div className="movelikeone">
              <h3 className="phimtile">Phim</h3>
              <div
                className={`row move-itemone ${
                  movies.length > 1 ? "more-than-one" : ""
                }`}
              >
                {movies.length > 0 ? (
                  movies.map((movie) => (
                    <div key={movie.id} className="col-lg-2 move-itemone-1">
                      <Link
                        state={{ movieId: movie.id }}
                        to={`/movie-detail/${movie.slug}`}
                      >
                        <img
                          src={movie.poster || undefined}
                          alt={movie.name}
                        />
                      </Link>
                      <h4>
                        {movie.movie_name.length > 20
                          ? `${movie.movie_name.slice(0, 10)}...`
                          : movie.movie_name}
                      </h4>
                      <p>{movie.release_date}</p>
                    </div>
                  ))
                ) : (
                  <div className="timkiemphim2">Không có phim nào phù hợp.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* MovieBanner chỉ hiển thị khi không có kết quả */}
      {!loading && movies.length === 0 && <MovieBanner />}
      <Footer />
    </>
  );
};

export default SearchMovies;
