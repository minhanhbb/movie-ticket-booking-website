import { Movie } from "./Movie";

 export interface Showtime {
    id: number;
    movie_id: number;
    room_id: number;
    showtime_date: string;
    showtime_start: string;
    showtime_end: string;
    status: string;
    movie:Movie;
  }
  