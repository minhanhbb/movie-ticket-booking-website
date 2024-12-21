import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Headerticket from "../Headerticket/Headerticket";
import Footer from "../Footer/Footer";
import instance from "../../server";
import "./OrderPage.css";
import { Combo } from "../../interface/Combo";
import Header from "../Header/Hearder";
import { useRealtime } from "../../Context/RealtimeContext";

export interface LocationState {
  movieName: string;
  cinemaName: string;
  showtime: string;
  seats: Array<{ seat_name: string; room_id: number; showtime_id: number; seat_row: number; seat_column: number; }>;
  totalPrice: number;
  showtimeId: number;
  roomId: number;
  cinemaId: number;
}

const OrderPage: React.FC = () => {
  const location = useLocation();
  const {
    movieName,
    cinemaName,
    showtime,
    seats,
    totalPrice: initialTotalPrice,
    showtimeId,
    roomId,
    cinemaId,
  } = (location.state as LocationState) || {};
  
 
  const [combos, setCombos] = useState<Combo[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(initialTotalPrice || 0);
  const [comboQuantities, setComboQuantities] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const { setupRealtime } = useRealtime();
  const handleContinue = () => {
    const selectedCombos = comboQuantities
      .map((quantity, index) => {
        if (quantity > 0) {
          return {
            id: combos[index].id,
            quantity: quantity,
            combo_name: combos[index].combo_name,
            
          };
        }
        return null;
      })
      .filter((combo) => combo !== null);

    // Chuyển hướng sang trang pay với tất cả thông tin cần thiết
    navigate("/pay", {
      state: {
        movieName,
        cinemaName,
        showtime,
        seats,
        totalPrice,
        showtimeId,
        roomId,
        cinemaId,
        selectedCombos, // Pass the selected combos to the next page
      },
    });
    // console.log("bjasfjaf",showtimeId);
    
  };

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await instance.get(`/showtimes/${showtimeId}`);
        setCombos(response.data.data.cinema_combos);

        setComboQuantities(new Array(response.data.data.cinema_combos.length).fill(0));
      } catch (error) {
        console.error("Error fetching combos:", error);
      }
    };
    setupRealtime();
    fetchCombos();
  }, [setupRealtime]);

  const handleQuantityChange = (index: number, delta: number): void => {
    const newQuantities = [...comboQuantities];
    const newQuantity = newQuantities[index] + delta;

    if (delta > 0 && newQuantity > combos[index].volume) {
      alert(`Sản phẩm ${combos[index].combo_name} hiện hết hàng`);
      return;
    }

    if (newQuantity >= 0) {
      newQuantities[index] = newQuantity;
      setComboQuantities(newQuantities);

      const priceDifference = delta * combos[index].price;
      setTotalPrice((prevTotal) => prevTotal + priceDifference);
      setErrorMessage("");
    }
  };

  return (
    <>
      <Header />
      <Headerticket />
      <div className="combo-list">
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="thongtincombo">
          <div className="combo-header">
            <div className="item">COMBO</div>
            <div className="item">GIÁ TIỀN</div>
            <div className="item fix-item">SỐ LƯỢNG</div>
          </div>
          {Array.isArray(combos) &&
            combos.map((combo, index) => (
              <div key={combo.id} className="combo-item">
                <div className="combo-info">
                  <div className="combo-name">{combo.combo_name}</div>
                  <div className="description">{combo.descripton}</div>
                </div>
                <div className="combo-price">
                  {combo.price.toLocaleString("vi-VN")} đ
                </div>
                <div className="combo-quantity">
                  <button
                    className="iconcong"
                    onClick={() => handleQuantityChange(index, -1)}
                  >
                    -
                  </button>
                  <span>{comboQuantities[index]}</span>
                  <button
                    className="iconcong"
                    onClick={() => handleQuantityChange(index, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
        </div>
        <div className="thongtinphim-container">
  <div className="thongtinphim2">
    <div className="details-box2">
      <p className="tenphimm">{movieName}</p>
      <p>
        Rạp: <span>{cinemaName}</span>
      </p>
      <p>
        Suất: <span>{showtime}</span>
      </p>
      <p>
        Ghế: <span>{seats.map((seat) => seat.seat_name).join(", ")}</span>
      </p>
    </div>
  </div>

  <div className="price-box2">
    <div className="price">
    <span className="tongdonhangg">  Tổng đơn hàng</span>
      <br /> <span>
  {totalPrice.toLocaleString("vi-VN")} VND
</span>
    </div>
  </div>

  <div className="actionsts">
    <Link to="/" className="back-btn2">
      <span>←</span> 
    </Link>
    <button className="continue-btn2" onClick={handleContinue}>
      Tiếp Tục
    </button>
  </div>
</div>


      </div>
      <Footer />
    </>
  );
};

export default OrderPage;