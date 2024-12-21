export interface SeatProps {
    type: string | null;
    index: number;
    row: string;
    onSeatClick: (row: string, seatIndex: number) => void;
    isSelected: boolean;
    isReserved: boolean;
  }