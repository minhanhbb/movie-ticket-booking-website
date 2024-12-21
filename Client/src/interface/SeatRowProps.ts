export interface SeatRowProps {
    row: string | { row: string; seats: (string | null)[] };
    onSeatClick: (row: string, seatIndex: number) => void;
    selectedSeats: Map<string, number[]>;
    reservedSeats: Set<string>;
  }