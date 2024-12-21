import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination } from "swiper/modules";
import "./Community.css";
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import { notification } from "antd";
import { useMovieContext } from "../../Context/MoviesContext";
import instance from "../../server";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Rating {
  id: number;
  user: { avatar: string };
  user_name: string;
  rating: number;
  movie_name: string;
}

const Community: React.FC = () => {
  const {
    state: { movies },
  } = useMovieContext();
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [visibleRatings, setVisibleRatings] = useState(5);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingRatings, setLoadingRatings] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await instance.get("/rating");
        setRatings(response.data.data);
      } catch {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải dữ liệu đánh giá.",
        });
      } finally {
        setLoadingRatings(false);
      }
    };

    fetchRatings();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await instance.get("/user");
          const favoriteMovies = response.data.favorite_movies.reduce(
            (acc: { [key: string]: boolean }, movie: any) => {
              acc[movie.id] = true;
              return acc;
            },
            {}
          );
          setFavorites(favoriteMovies);
        } catch (error) {
          console.error("Lỗi tải danh sách yêu thích:", error);
        } finally {
          setLoadingMovies(false);
        }
      } else {
        setLoadingMovies(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleFavoriteToggle = async (movieId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      notification.warning({
        message: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để thêm phim vào danh sách yêu thích!",
      });
      return;
    }

    try {
      if (favorites[movieId]) {
        await instance.delete(`/favorites/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        notification.success({
          message: "Thành công",
          description: "Phim đã được xóa khỏi danh sách yêu thích!",
        });
      } else {
        await instance.post(
          `/favorites/${movieId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        notification.success({
          message: "Thành công",
          description: "Phim đã được thêm vào danh sách yêu thích!",
        });
      }
      setFavorites((prev) => ({ ...prev, [movieId]: !prev[movieId] }));
    } catch (error) {
      console.error("Lỗi xử lý yêu thích phim:", error);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi xử lý yêu thích phim.",
      });
    }
  };

  const handleShowMore = () => {
    setVisibleRatings((prev) => prev + 5);
  };

  return (
    <>
      <Header />
      <div className="trendingMovies">
  <h1 className="heading">Thịnh hành</h1>
  <p className="subheading">Các phim được yêu thích trong tuần</p>

  <Swiper
    spaceBetween={10}
    pagination={{ clickable: true }}
    modules={[Pagination]}
    className="movieList"
    breakpoints={{
      1024: { slidesPerView: 7 },
      768: { slidesPerView: 5 },
      390: { slidesPerView: 2 },
    }}
  >
    {loadingMovies
      ? Array.from({ length: 7 }).map((_, index) => (
          <SwiperSlide key={`skeleton-${index}`}>
            <Skeleton
            width={400}
              height={200}
              style={{ borderRadius: "8px", margin: "0 10px" }}
            />
          </SwiperSlide>
        ))
      : movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div className="movieCard">
              <img
                src={movie.poster || ""}
                alt={movie.movie_name}
                className="movieImage"
              />
              <div
                className={`heartIcon ${
                  favorites[movie.id] ? "active" : ""
                }`}
                onClick={() => handleFavoriteToggle(movie.id)}
              ></div>
              <p className="movieTitle">{movie.movie_name}</p>
            </div>
          </SwiperSlide>
        ))}
  </Swiper>
</div>


      <div className="hoat-dong-moi">
      <div className="danh-sach-hoat-dong">
    <h2 className="tieu-de">FlickHive-er đang làm gì?</h2>
    {loadingRatings
      ? Array.from({ length: 5 }).map((_, index) => (
          <div className="hoat-dong-item" key={`skeleton-rating-${index}`}>
            <Skeleton
              circle
              height={40}
              width={40}
              style={{ marginRight: "10px" }}
            />
            <Skeleton height={20} width="60%" />
          </div>
        ))
      : ratings.slice(0, visibleRatings).map((rating) => (
          <div className="hoat-dong-item" key={rating?.id}>
            <div className="avatar-container">
              <img src={rating.user.avatar} alt="Avatar" className="avatar" />
            </div>
            <div className="noi-dung">
              <strong>{rating.user_name}</strong> đã đánh giá
              <span className="danh-gia"> {rating.rating} ⭐</span> cho
              <strong> {rating.movie_name}</strong>
            </div>
          </div>
        ))}
    {visibleRatings < ratings.length && !loadingRatings && (
      <button className="xem-them" onClick={handleShowMore}>
        Xem thêm
      </button>
    )}
  </div>
  <div className="phe-binh-chuyen-nghiep">
  <h3>FlickHive's Approved Critics</h3>
  <ul className="danh-sach-phe-binh">
    {loadingRatings
      ? Array.from({ length: 5 }).map((_, index) => (
          <li className="phe-binh-item" key={`skeleton-critic-${index}`}>
            <Skeleton
              circle
              height={40}
              width={40}
              style={{ marginRight: "10px" }}
            />
            <Skeleton height={20} width="80%" />
          </li>
        ))
      : ratings.slice(0, visibleRatings).map((rating) => (
          <li className="phe-binh-item" key={rating?.id}>
            <img src={rating.user.avatar} alt="Avatar" className="avatar" />
            <div className="thong-tin">
              <div className="ten">{rating.user_name}</div>
              {/* <div className="mo-ta">{critic.description}</div> */}
            </div>
          </li>
        ))}
    {visibleRatings < ratings.length && (
      <button className="xem-them" onClick={handleShowMore}>
        Xem thêm
      </button>
    )}
  </ul>
</div>

      </div>
      <Footer />
    </>
  );
};

export default Community;
