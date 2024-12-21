import { User } from "./User";

import { PayMethod } from "./PayMethod";
import { Movie } from "./Movie";
import { Showtime } from "./Showtimes";
import { Room } from "./Room";
import { Combo } from "./Combo";

import {Seat} from './Seat'
import { Pivot } from "./Pivot";

export interface Booking {
  id: string;
  user_id : number;
  showtime_id : number;
  pay_method_id : number;
  price_ticket: number;
  price_combo: number;
  amount:number;
  status: string;
  user: User;
  showtime: Showtime;
  pay_method : PayMethod;
  movie: Movie;
  room: Room
  combos: Combo[]
  qrcode: string
  barcode: string
  seats: Seat[]
  booking_code: string
  created_at: string
}
