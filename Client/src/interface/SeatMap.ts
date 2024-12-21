import { SeatAdmin } from "./SeatAdmin";

 export interface SeatMapAdmin {
    id: number;
    name: string;
    description: string;
    matrix_row: number;
    matrix_column: number;
    row_regular_seat: number;
    row_vip_seat: number;
    row_couple_seat: number;
    seat_structure: SeatAdmin[] | null;
    created_at: string;
    updated_at: string;
    status: boolean;
  }