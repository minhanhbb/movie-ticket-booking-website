import { Cinema } from "./Cinema";
import { SeatLayout } from "./SeatLayout";

export interface Room {
  isActive: boolean | undefined;
  id: number; 
  cinema:Cinema;
  cinema_id: number; 
  seat_map_id: number;
  room_name: string; 
  status: boolean; 
  created_at: string | null; 
  updated_at: string | null;
}
