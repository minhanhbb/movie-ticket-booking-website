import React from "react";
import { SeatProps } from "../../interface/SeatProps";
import "./CinemaSeatSelection.css";

const Seat: React.FC<SeatProps> = ({
  type,
  index,
  row,
  onSeatClick,
  isSelected,
  isReserved,
}) => {
  const handleClick = () => {
    if (!isReserved) {
      onSeatClick(row, index);
    }
  };

  const seatClassName = `seat ${isReserved ? "reserved" : ""} ${
    isSelected ? "selected" : ""
  } ${type === "VIP" ? "vip" : type === "COUPLE" ? "couple-seat" : "normal"}`;

  return (
    <span className={seatClassName} onClick={handleClick}>
      {`${row}${index + 1}`}
    </span>
  );
};

export default Seat;
