import React, { useState, useEffect } from 'react';
import instance from '../../server';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';
import './CinemaInfo.css';

const ThongTinRap = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  ); // Default to current date
  const [movies, setMovies] = useState<any[]>([]); // Store movies data
  const [cinema, setCinema] = useState<any>(null); // Store cinema data

    const navigate = useNavigate();
  const { cinemaId } = useParams();

  useEffect(() => {
    const fetchCinemaAndMovies = async () => {
      try {
        // Fetch movie schedule and cinema details
        const response = await instance.get('/filterByDate', {
          params: {
            cinema_id: cinemaId,
            showtime_date: selectedDate,
          },
        });

        // Extract cinema and movies
        const cinemaData = response.data?.cinema?.[0];
        // console.log(response.data?.cinema)
        const moviesData = response.data?.data;

        setCinema(cinemaData);
        setMovies(moviesData);
      } catch (error) {
        console.error('Error fetching cinema or movie schedule:', error);
      }
    };

    fetchCinemaAndMovies();
  }, [selectedDate, cinemaId]);

  // Generate week days for calendar
  const generateWeekDays = () => {
    const days = [];
    const currentDate = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        weekDay: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
      });
    }
    return days;
  };

  return (
    <>
      <Header />
      <div className="rap-container">
        {/* Cinema Header */}
        {cinema && (
          <>
            <div className="rap-header">
              <img
                src='../../../public/logo.jpg'
                alt="Cinema Logo"
                className="rap-logo"
              />
              <div className="rap-chi-tiet">
                <p className="rap-dia-chi">{cinema.cinema_address || 'Địa chỉ không có sẵn'}</p>
                <div className="rap-hanh-dong">
                  <span className="hanh-dong-item">📍 Bản đồ</span>
                  <span className="hanh-dong-item">📍 {cinema.city || 'Chưa rõ thành phố'}</span>
                  <span className="hanh-dong-item">
                    ☰ {cinema.cinema_name || 'Tên rạp không có sẵn'}
                  </span>
                </div>
              </div>
            </div>

            {/* Cinema Description */}
            <div className="rap-mo-ta">
              <p>
                Lịch chiếu phim {cinema.cinema_name || 'Rạp'} - Thông tin rạp chiếu phim chi tiết và
                đầy đủ nhất.
              </p>
            </div>
          </>
        )}

        {/* Calendar */}
        <div className="calendar-custom">
          {generateWeekDays().map((day, index) => (
            <div
              key={index}
              className={`date-custom ${selectedDate === day.date ? 'active' : ''}`}
              onClick={() => setSelectedDate(day.date)}
            >
              <span>{day.day}</span>
              <small>{day.weekDay}</small>
            </div>
          ))}
        </div>

        <div className="thong-baooo">
  {movies?.length > 0 ? (
    <span>ℹ️ Nhấn vào suất chiếu để tiến hành mua vé</span>
  ) : (
    <span>ℹ️ Không có lịch chiếu cho ngày hôm nay</span>
  )}
</div>


        {/* Movie List */}
        <div className="lich-phim">
          {movies?.length > 0 ? (
            movies.map((movie, index) => (
              <div className="phim-item" key={index}>
                <img
                  className="phim-anh"
                  src={movie.poster || 'https://via.placeholder.com/150'}
                  alt={movie.movie_name}
                />
                <div className="phim-chi-tiet">
                  <h3>{movie.movie_name}</h3>
                  <p className="phim-phu">{movie.age_limit} · {movie.country} · Trailer</p>
                  <div className="phim-ngon-ngu">Phụ đề tiếng Việt</div>
                  <div className="phim-thoi-gian">
                    {movie.showtimes?.map((showtime: any, i: number) => (
                      <div key={i} className="thoi-gian-item">
                     
                     <span className="gio"> {showtime.showtime_start.substring(0, 5)}</span>
                        <span className="gia"  onClick={() =>
                                navigate("/seat", {
                                  state: {
                                    movieName: movie.movie_name,
                                    showtime: showtime.showtime_start,
                                    showtimeId: showtime.id,
                                    price: showtime.price,
                                  },
                                })
                              }>{showtime.price / 1000}K</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) :null}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ThongTinRap;
