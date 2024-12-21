import React, { useEffect, useState } from "react";

import Footer from "../Footer/Footer";
import './Video.css';
import Slider from "react-slick";
import { useQuery } from "@tanstack/react-query";
import Header from "../Header/Hearder";
import { NewsItem } from "../../interface/NewsItem";
import instance from "../../server";
import { Link, useParams } from "react-router-dom";
import { Movie } from "../../interface/Movie";
import { Modal } from "antd";
import { stripHtml } from '../../assets/Font/quillConfig';
import { useNews } from "../../Context/NewsContext";
import { useMovieContext } from "../../Context/MoviesContext";


function Video() {
    const { state: { movies } } = useMovieContext();

    const [news, setNews] = useState<NewsItem[]>([]);
    const [isTrailerVisible, setIsTrailerVisible] = useState(false);
    const [movie, setMovie] = useState<Movie | null>(null); // Khởi tạo null

    // Cấu hình cho slider
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
              slidesToShow: 5,
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
    

    const { newsData, error } = useNews();  // Lấy dữ liệu từ context

    if (error) {
      return <div className="error">Error: {error}</div>;  // Xử lý lỗi nếu có
    }
  
    // Hàm xử lý khi click vào poster
    const handleMovieClick = (selectedMovie: Movie) => {
        setMovie(selectedMovie); // Cập nhật state movie
        setIsTrailerVisible(true); // Hiển thị Modal
    };

    return (
        <>
            <Header />
            <div className="Contentseach">
                <div className="banner-movies">
                    <h2>Video - Trailer</h2>
                    <div className="text-white mt-0 description">
                        Trailer, video những phim chiếu rạp và truyền hình hot nhất
                    </div>
                </div>
                <div className="movie-banner">
                    <div className="movie-slider">
                        <div className="slider-container">
                            <Slider {...settings}>
                                {movies?.map((movie) => (
                                    <div key={movie.id}>
                                        <div className="movie-item" onClick={() => handleMovieClick(movie)}>
                                            <img
                                                src={movie.poster || "placeholder.jpg"}
                                                alt={movie.movie_name}
                                            />
                                            <i className="fas fa-play-circle video-icon"></i>
                                            <div className="movie-info">
                                                <p className="name_movie">{movie.movie_name}</p>
                                                <span>
                                                    {movie.release_date
                                                        ? new Date(movie.release_date).toLocaleDateString("vi-VN")
                                                        : "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
                <div className="container box-cha2">
                    <div className="row boxcha-4">
                        <div className="tintucmoi col-lg-8 col-md-10 col-sm-12">
                            <h2>Mới Nhất</h2>

                            {newsData.map((item) => (
                    <div key={item.id} className="div-item">
                      <div className="img">
                        <img src={item.thumnail} alt={item.title} />
                      </div>
                      <div className="content-new">
                        <Link to={`/postdetail/${item.slug}`}><h3>{item.title}</h3></Link>
                        <p>{stripHtml(item.content)}</p>
                      </div>
                    </div>
                  ))}
                        </div>
                        <div className="chuyenmuc col-lg-4 col-md-2 col-sm-12">
                            <h3>Chuyên mục</h3>
                            <div className="noidung">
                                <h4>Đánh giá phim</h4>
                                <p>Góc nhìn chân thực, khách quan nhất về các bộ phim</p>
                            </div>
                            <div className="noidung">
                                <Link to={'/FilmNews'}><h4>Tin điện ảnh</h4></Link>
                                <p>Tin tức điện ảnh Việt Nam & thế giới</p>
                            </div>
                            <div className="noidung">
                                <h4>Video - Trailer</h4>
                                <p>Trailer, video những phim chiếu rạp và truyền hình hot nhất</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            <Modal
  title={movie?.movie_name || "Trailer"} // Nếu không có tên phim, hiển thị tiêu đề mặc định
  open={isTrailerVisible}
  onCancel={() => setIsTrailerVisible(false)}
  footer={null}
  centered // Modal xuất hiện giữa màn hình
  className="custom-modal"
>
  <iframe
    width="100%"
    height="340px"
    src={movie?.trailer || "https://youtu.be/eW4AM1539-g?si=LSsCYUB0CVCH04id"} // Video mặc định
    title="Trailer"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    style={{ borderRadius: "10px", border: "none" }} // Tùy chỉnh giao diện iframe
  ></iframe>
</Modal>

        </>
    );
}

export default Video;
