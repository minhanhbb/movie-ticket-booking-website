
import { Cinema } from "./Cinema";
import { Movie } from "./Movie";
import { Room } from "./Room";

import { Seat } from "./Seat";
import { SeatMap } from "./SeatMapp";

export interface Showtime {
    movie: Movie; 
    
    id: number;
    movie_id: number;
    cinema_id: number;
    showtime_date: string;
    showtime_start: string;
    showtime_end: string;
    date: string;
    opening_time: string;
    closing_time:string;
    duration: string;
    cinema:string;
    status: string;
    price: number;
    room_id:number;
    room : Room;
    showtime_id:number;
    
   
    
    // Include the Movie interface
}
export interface Showtime2 {
    id: number;
    movie_id: number;
    movie: Movie;
    room_id: number;
    room: {
      id: string;
      room_name: string;
      cinema: Cinema;
      seat_map: SeatMap;
    };
    showtime_date: string;
    showtime_start: string;
    showtime_end: string;
    price: number;
    status: number;
    created_at: string;
    updated_at: string;
  }
