export interface SeatAdmin {
    row: string;
    type: 'Regular' | 'VIP' | 'Couple';
    label: string;
    column: number;
    status: number;
    is_double: number;
    linkedSeat: string | null;
  }