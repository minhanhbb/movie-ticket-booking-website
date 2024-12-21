import React, { useState, useEffect } from "react";
import instance from "../../server";
import "./CinemaSelector.css";
import { Cinema } from "../../interface/Cinema";
import { Actor } from "../../interface/Actor";
import { Movie } from "../../interface/Movie";
import { useNavigate } from "react-router-dom"; 
import dayjs from "dayjs";
import { useCountryContext } from "../../Context/CountriesContext";
import { Skeleton, Spin } from 'antd';  // Import Spin từ Ant Design
import { UserProfile } from "../../interface/UserProfile";
import { useCinemaContext } from "../../Context/CinemasContext";



  const CinemaSelector: React.FC = () => {
    const [actors, setActors] = useState<Actor[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedCity, setSelectedCity] = useState<number >();
    const { state} = useCinemaContext();
    const [selectedCinema, setSelectedCinema] = useState<number>();
    const [selectedDate, setSelectedDate] = useState<string>("");
  
    const [filteredCinemas, setFilteredCinemas] = useState<Cinema[]>([]);
    const [loading, setLoading] = useState<boolean>(false);  
  
    const navigate = useNavigate();
    
    // Lấy danh sách vị trí từ CountryContext
    const {
      state: { countries: locations },
    } = useCountryContext();
  
    const cinemas = state.cinemas;
    const getCurrentDate = (): string => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
 
    
    const generateDateList = (): string[] => {
      return Array.from({ length: 7 }, (_, i) =>
        dayjs().add(i, "day").format("YYYY-MM-DD")
      );
    };
  
    const [userRole, setUserRole] = useState<string>("");

    // Fetch user role from localStorage
    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem("user_profile") || "{}");
      const roles = userData.roles || [];
      console.log("data role:", roles);
      if (roles.length > 0) {
        setUserRole(roles[0].name);
      } else {
        setUserRole("unknown"); // Gán giá trị mặc định khi không có vai trò
      }
    }, []);
    
 
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await instance.get("/actor");
          setActors(response.data.data || []);
        } catch (error) {
          setActors([]);
        }
        setLoading(false);
      };
      fetchData();
      setSelectedDate(getCurrentDate());
    }, []);
    
  
    useEffect(() => {
      if (cinemas.length > 0 && locations.length > 0) {
          const sortedLocations = locations
              .map((location) => ({
                  ...location,
                  cinemaCount: cinemas.filter(
                      (cinema) => cinema.location_id === location.id
                  ).length,
              }))
              .sort((a, b) => b.cinemaCount - a.cinemaCount);
  
          const locationWithMostCinemas = sortedLocations[0];
          
              setSelectedCity(locationWithMostCinemas?.id);
          
      }
  }, [cinemas, locations]);
  
    useEffect(() => {
      if (cinemas.length > 0) {
        const sortedLocations = locations
          .map((location) => ({
            ...location,
            cinemaCount: cinemas.filter(
              (cinema) => cinema.location_id === location.id
            ).length,
          }))
          .sort((a, b) => b.cinemaCount - a.cinemaCount);
  
        const locationWithMostCinemas = sortedLocations[0];

        setSelectedCity(locationWithMostCinemas?.id);
     
        
      }
    }, [cinemas, locations]);
  
    const sortedLocations = locations
      .map((location) => ({
        ...location,
        cinemaCount: cinemas.filter(
          (cinema) => cinema.location_id === location.id
        ).length,
      }))
      .sort((a, b) => b.cinemaCount - a.cinemaCount);
  
    const filteredLocations = sortedLocations.filter((location) =>
      cinemas.some((cinema) => cinema.location_id === location.id)
    );
  
    useEffect(() => {
      if (selectedCity) {
        const filtered = cinemas.filter(
          (cinema) => cinema.location_id === selectedCity
        );
        setFilteredCinemas(filtered);
        if (filtered.length > 0) {
          setSelectedCinema(filtered[0].id); 
        }
      } else {
        setFilteredCinemas(cinemas);
      }
    }, [selectedCity, cinemas]);
  
    useEffect(() => {
      const fetchMoviesForSelectedCinemaAndDate = async () => {
        if (selectedCinema && selectedDate) {
       
          try {
            let response;
            if (userRole === "admin") {
              // Admin has access to the full list
              response = await instance.get(`/admin/filterByDate`, {
                params: {
                  cinema_id: selectedCinema,
                  showtime_date: selectedDate,
                },
              });
            } else if (userRole === "staff") {
              // Staff has limited access, for example to a specific endpoint
              response = await instance.get(`/staff/filterByDate`, {
                params: {
                  cinema_id: selectedCinema,
                  showtime_date: selectedDate,
                },
              });
            } else if (userRole === "manager") {
              // Manager also has a specific endpoint
              response = await instance.get(`/manager/filterByDate`, {
                params: {
                  cinema_id: selectedCinema,
                  showtime_date: selectedDate,
                },
              });
            } else {
              response = await instance.get(`/filterByDate`, {
                params: {
                  cinema_id: selectedCinema,
                  showtime_date: selectedDate,
                },
              });
            }
    
            const cinemaMovies = response.data?.data || [];
            setMovies(cinemaMovies);
          } catch (error) {
            setMovies([]);
            console.error("Error fetching movies:", error);
          }
         
        }
      };
    
      fetchMoviesForSelectedCinemaAndDate();
    }, [selectedCinema, selectedDate, userRole]);
    
  
    const selectedCinemaDetails = cinemas.find(
      (cinema) => cinema.id === selectedCinema
    );
  
  
    
    // If the user is an admin, only show the first location and first cinema
const displayLocations = filteredLocations;
    const displayCinemas =filteredCinemas;
    return (
      <div className="div-content">
        <h2 className="titles">Mua vé theo rạp</h2>
        <div className="container">
          <div className="locations">
            <h3 className="khuvuc">Khu vực</h3>
            <ul className="list-tp">
              <div className="list">
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                  active
                  style={{
                    width: "100%", // Chiều rộng thanh ngang
                    height: 20,    // Chiều cao của thanh (tùy chỉnh)
                    marginBottom: 10,
                  }}
                />
                  ))
                :displayLocations.map((location) => (
                  <li
                    key={location.id}
                    className={`city ${selectedCity === location.id ? "selected" : ""}`}
                    onClick={() => setSelectedCity(location.id)}
                  >
                    {location.location_name}
                    <span className="cinema-count">{location.cinemaCount}</span>
                  </li>
                ))}
              </div>
             
                <select
                  className="city-selects"
                  value={selectedCity ?? ""}
                  onChange={(e) => setSelectedCity(Number(e.target.value))}
                >
                  <option className="city-selects-option" value="">
                    Chọn khu vực
                  </option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.location_name}
                    </option>
                  ))}
                </select>
             
            </ul>
          </div>
  
          <div className="cinemas">
            <h3 className="khuvuc">Rạp</h3>
            <ul className="list-tp">
              <div className="list">
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      active
                      style={{ width: "100%", marginBottom: 10 }}
                    />
                  ))
                :displayCinemas.map((cinema) => (
                  <li
                    key={cinema.id}
                    className={`cinema ${selectedCinema === cinema.id ? "selected" : ""}`}
                    onClick={() => setSelectedCinema(cinema.id )}
                  >
                    {cinema.cinema_name}
                  </li>
                ))}
              </div>
             
                <select
                  className="city-selects"
                  value={selectedCinema ?? ""}
                  onChange={(e) => setSelectedCinema(Number(e.target.value))}
                >
                  <option className="city-selects-option" value="">
                    Chọn rạp
                  </option>
                  {filteredCinemas.map((cinema) => (
                    <option key={cinema.id} value={cinema.id}>
                      {cinema.cinema_name}
                    </option>
                  ))}
                </select>
            
            </ul>
          </div>
  
          <div className="showtimes">
            <div className="calendar-custom-1">
              {generateDateList().map((date) => (
                <div
                  key={date}
                  className={`date-custom-1 ${selectedDate === date ? "active" : ""}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <span>{dayjs(date).format("DD/MM")}</span>
                  <small>{dayjs(date).day() === 0 ? "CN" : `Thứ ${dayjs(date).day() + 1}`}</small>
                </div>
              ))}
            </div>
            {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                active
                avatar
                paragraph={{ rows: 3 }}
                style={{ marginBottom: 20 }}
              />
            ))
          ) : movies.length > 0 ? (
              <div className="movies">
                {movies.map((movieData) => {
                  const movie = movieData;
  
                  const sortedShowtimes = movieData.showtimes.sort((a: any, b: any) => {
                    const timeA = dayjs(`${selectedDate} ${a.showtime_start}`, "YYYY-MM-DD HH:mm");
                    const timeB = dayjs(`${selectedDate} ${b.showtime_start}`, "YYYY-MM-DD HH:mm");
                    return timeA.isBefore(timeB) ? -1 : 1;
                  });
  
                  return (
                    <div key={movie.id} className="movie">
                      <img src={movie.poster ?? undefined} alt={movie.movie_name} />
                      <div className="details">
                        <h4>{movie.movie_name}</h4>
                        <p>Thời gian: {movie.duration} phút</p>
                        <p>Giới hạn tuổi: {movie.age_limit}+</p>
                        <div className="showtimes-list">
                          {sortedShowtimes.map((showtime: any) => (
                            <button
                              key={showtime.id}
                              disabled={dayjs(`${selectedDate} ${showtime.showtime_start}`).isBefore(dayjs())}
                              onClick={() =>
                                navigate("/seat", {
                                  state: {
                                    movieName: movie.movie_name,
                                    cinemaName: selectedCinemaDetails?.cinema_name,
                                    showtime: showtime.showtime_start,
                                    showtimeId: showtime.id,
                                    cinemaId: selectedCinemaDetails?.id,
                                    price: showtime.price,
                                  },
                                })
                               
                              }
                              
                            >
                              
                              {showtime.showtime_start.slice(0, 5)}
                              <p> {`${showtime.price / 1000}k`}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-showtime-message">Không có suất chiếu</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  

  
export default CinemaSelector;
