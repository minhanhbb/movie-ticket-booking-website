
export interface SeatLayout {
    id: number; // Trường id (bigint UNSIGNED)
    name: string; // Trường name (varchar(255))
    rows: number; // Trường rows (int)
    columns: number; // Trường columns (int)
    row_regular_seat: number; // Trường row_regular_seat (int)
    row_vip_seat: number; // Trường row_vip_seat (int)
    row_couple_seat: number; // Trường row_couple_seat (int)
    status: 'Bản nháp' | 'Xuất bản'; // Trường status (enum)
    created_at: string | null; // Trường created_at (timestamp)
    updated_at: string | null; // Trường updated_at (timestamp)
  }
  