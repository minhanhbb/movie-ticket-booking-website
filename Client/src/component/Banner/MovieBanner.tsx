import React from "react";
import "./MovieBanner.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { LikeOutlined } from '@ant-design/icons';
import { useMovieContext } from "../../Context/MoviesContext";
const MovieBanner = () => {
  const { state: { movies } } = useMovieContext();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToScroll: 4,
    slidesToShow: 8,
    draggable: true,
    swipe: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };
  return (
    <div className="movie-banner">
      <div className="banner-header">
        <h2>Đang chiếu</h2>|<h2 style={{ color: "#95aac9" }}><Link to={'/upcoming-movies'}>Sắp chiếu</Link></h2>
      </div>
      <div className="movie-slider">
        <div className="slider-container">
          <Slider {...settings}>
            {movies.map((movie) => (
              <div key={movie.id}>
                <div className="movie-item">
                  <Link to={`/movie-detail/${movie.slug}`}>
                    <img
                      src={movie.poster || "placeholder.jpg"}
                      alt={movie.movie_name}
                    />
                  </Link>
                  <div className="movie-info">
                    <button className="buy-ticket">
                      <Link to={`/buy-now/${movie.slug}`}>Mua vé</Link>
                    </button>
                    <p className="name_movie">{movie.movie_name}</p>
                    <span>
    {movie.release_date
        ? new Date(movie.release_date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit"
        }).replace('-', '/')
        : "N/A"}
</span>
<span className="rating-1">
<LikeOutlined  className="icon-likee"
    style={{
    position:"relative",
    left:"8px",
      color: "#28a745",           
      background: "none",        
      fontSize: "16px"            
    }} 
  />
  {typeof movie.rating === 'number' ? (movie.rating * 10).toFixed(0) : 0}%
</span>     
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default MovieBanner;
