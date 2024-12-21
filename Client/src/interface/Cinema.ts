// src/interfaces/Cinema.ts
import { Location } from "./Location";
import { Movie } from "./Movie";
import { Showtime } from "./Showtimes";


export interface Cinema {
  id?: number;
  cinema_name: string;
  phone: string;
  location_id: number;
  cinema_address: string;
  status: string;
  showtimes: Showtime[];
  movies: Movie[]; // Chỉnh sửa từ 'movie' thành 'movies' để đồng nhất
  movie_in_cinema?: number[]; // Thêm trường này để lưu ID của các bộ phim trong rạp
  location: Location
}
