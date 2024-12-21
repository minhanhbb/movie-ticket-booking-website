import React, { useState, useEffect } from "react";
import "./LichChieu.css";

import Footer from "../Footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { useCountryContext } from "../../Context/CountriesContext";

import instance from "../../server"; // API instance
import { Cinema } from "../../interface/Cinema";

import { useMovieContext } from "../../Context/MoviesContext";
import { Showtime } from "../../interface/Showtimes";
import MovieDetail from "./MovieDetail";

const MuaVe: React.FC = () => {
  const { slug } = useParams();
  const { state: countryState, fetchCountries } = useCountryContext();
  const { state, fetchMovies } = useMovieContext(); // Lấy phim từ MovieContext
  const navigate = useNavigate();

  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  ); // Ngày hiện tại
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  // Fetch user role from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_profile") || "{}");
    const roles = userData.roles || [];
    // console.log("data role:", roles);
    if (roles.length > 0) {
      setUserRole(roles[0].name);
    } else {
      setUserRole("unknown"); // Gán giá trị mặc định khi không có vai trò
    }
  }, []);
  // Lấy phim theo ID
  const movie = state.movies.find((movie) => movie.slug === slug);
  useEffect(() => {
    fetchMovies(); // Gọi lại fetchMovies khi slug thay đổi
  }, [slug]);

  useEffect(() => {
    fetchCountries(); // Lấy danh sách khu vực
  }, [fetchCountries]);

  useEffect(() => {
    if (countryState.countries.length > 0 && !selectedLocation) {
      setSelectedLocation(countryState.countries[0].id.toString()); // Mặc định chọn khu vực đầu tiên
    }
  }, [countryState, selectedLocation]);

  // Lấy danh sách rạp chiếu

  useEffect(() => {
    const fetchCinemasAndShowtimes = async () => {
      if (selectedLocation && movie?.id) {
        try {
          let response;
          if (userRole === "admin") {
            // Admin: full access to the cinemas and showtimes
            response = await instance.get(`/admin/filterByDateByMovie`, {
              params: {
                location_id: selectedLocation,
                showtime_date: selectedDate,
                movie_id: movie.id,
              },
            });
          } else if (userRole === "staff") {
            // Staff: access to a staff-specific endpoint (if any)
            response = await instance.get(`/staff/filterByDateByMovie`, {
              params: {
                location_id: selectedLocation,
                showtime_date: selectedDate,
                movie_id: movie.id,
              },
            });
          } else if (userRole === "manager") {
            // Manager: access to the manager-specific endpoint (if any)
            response = await instance.get(`/manager/filterByDateByMovie`, {
              params: {
                location_id: selectedLocation,
                showtime_date: selectedDate,
                movie_id: movie.id,
              },
            });
          } else {
            response = await instance.get(`/filterByDateByMovie`, {
              params: {
                location_id: selectedLocation,
                showtime_date: selectedDate,
                movie_id: movie.id,
              },
            });
          }
  
          const cinemaData = response.data?.data || [];
          setCinemas(
            cinemaData
          );
        } catch (err) {
          console.error("Error fetching cinemas and showtimes:", err);
       
        }
      }
    };
  
    fetchCinemasAndShowtimes();
  }, [selectedLocation, selectedDate, movie?.id, userRole]);

  const toggleCinemas = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Tạo danh sách ngày trong tuần
  const generateWeekDays = () => {
    const days = [];
    const currentDate = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      days.push({
        date: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        }),
        weekDay: date.toLocaleDateString("vi-VN", { weekday: "short" }),
      });
    }
    return days;
  };
  return (
    <>
      <MovieDetail />
      <div className="lich-chieu-container">
      <div className="calendar-container">
        <div className="row-custom">
          <select
            className="city-select-custom"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {countryState.countries.map((location) => (
              <option key={location.id} value={location.id.toString()}>
                {location.location_name}
              </option>
            ))}
          </select>
        </div>
        <div className="calendar-custom">
          {generateWeekDays().map((day, index) => (
            <div
              key={index}
              className={`date-custom ${selectedDate === day.date ? "active" : ""}`}
              onClick={() => setSelectedDate(day.date)}
            >
              <span>{day.day}</span>
              <small>{day.weekDay}</small>
            </div>
          ))}
        </div>
        <div className="cinema-list">
        {error ? (
        <p>{error}</p>
      ) : cinemas.length === 0 ? (
        <div className="thong-baooo-1">
          <span>ℹ️ Không có lịch chiếu cho ngày hôm nay</span>
        </div>
      ) : (
            cinemas.length > 0 ? (
              cinemas.map((cinema, index) => (
                <React.Fragment key={index}>
                  <div
                    className={`cinema-item ${expandedIndex === index ? "active" : ""}`}
                    onClick={() => toggleCinemas(index)}
                  >
                    <div className="cinema-logo">
                      <img
                        src="../../../public/logo.jpg"
                        alt={cinema.cinema_name}
                      />
                    </div>
                    <div className="cinema-info">
                      <p className="cinema-name">{cinema.cinema_name}</p>
                      <p className="cinema-branches">{cinema.showtimes.length} suất chiếu</p>
                    </div>
                  </div>
                  {expandedIndex === index && (
                    <div className="sub-cinema-list">
                      <p>{cinema.cinema_address}</p>
                      <div className="cinema-showtimes">
                        {cinema.showtimes.length > 0 ? (
                          cinema.showtimes
                            .sort((a: Showtime, b: Showtime) => {
                              const timeA = new Date(`${selectedDate}T${a.showtime_start}`).getTime();
                              const timeB = new Date(`${selectedDate}T${b.showtime_start}`).getTime();
                              return timeA - timeB;
                            })
                            .map((showtime: Showtime) => {
                              const showtimeDateTime = new Date(`${selectedDate}T${showtime.showtime_start}`);
                              const isPastShowtime = showtimeDateTime < new Date();
                              
                              return (
                                <span
                                  key={showtime.id}
                                  onClick={() => {
                                    if (!isPastShowtime) {
                                      navigate("/seat", {
                                        state: {
                                          movieName: movie?.movie_name,
                                          cinemaName: cinema.cinema_name,
                                          showtime: showtime.showtime_start,
                                          showtimeId: showtime.showtime_id,
                                          cinemaId:cinema.id,
                                          roomId: showtime.room_id,
                                          price: showtime.price,
                                        },
                                      });
                                    }
                                  }}
                                  style={{
                                    cursor: isPastShowtime ? "not-allowed" : "pointer",
                                    color: isPastShowtime ? "gray" : "black",
                                  }}
                                >
                                  {showtime.showtime_start.slice(0, 5)} <br />
                                  {`${showtime.price / 1000}k`}
                                </span>
                              );
                            })
                        ) : (
                          <p>Không có suất chiếu</p>
                        )}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className="thong-baooo-1">
                <span>ℹ️ Không có lịch chiếu cho ngày hôm nay</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
      <Footer />
    </>
  );
};

export default MuaVe;
