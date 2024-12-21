import { Combo } from "./Combo";
import { Seat } from "./Seat";

export default interface Ticket {
    id: string;
    amount: number;
    seats: Seat[]; // Type the seats array
    showtime: {
      showtime_date: string;
      showtime_start: string;
      room: {
        cinema_name: string;
        room_name: string;
      };
    };
    combos:Combo[];
  }
  