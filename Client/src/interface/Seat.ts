
  export interface Seat {
    seat_name: string;
    seat_row: number;
    seat_column: number;
    row: string;
    type: string;
    label: string;
    column: number;
    status: number;
    linkedSeat?: string;
    isSelected?: boolean; 
    isMainProcessed?: boolean;
    isDisabled?: boolean; 
    barcode: string;
  }