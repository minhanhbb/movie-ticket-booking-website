import React, { useEffect, useState } from 'react';
import './TicketCinema.css';
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';
import { Avatar } from 'antd';
import { Link, NavLink } from 'react-router-dom';
import instance from '../../server';
import { Showtime } from '../../interface/Showtimes';
import { Seat } from '../../interface/Seat';
import { useUserContext } from '../../Context/UserContext';
import { User } from '../../interface/User';

interface Order {
    id: number;
    user_id: number;
    showtime_id: number;
    pay_method_id: number;
    amount: number;
    barcode: string | null;
    qrcode: string;
    booking_code: string;
    status: string;
    created_at: string;
    updated_at: string;
    showtime: Showtime;
    user: User;

    seats: Seat[];

    
  }
const TicketCinema = () => {
  const { userProfile, avatar, setAvatar } = useUserContext(); // Access user profile and avatar from context
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    instance.get('/order') 

      .then(response => {

          setOrders(response.data.data);
       
      })
      .catch(error => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  return (
    <>
      <Header />
      <div className="banner">
        <img src="https://cdn.moveek.com/bundles/ornweb/img/tix-banner.png" alt="Banner" className="banner-img" />
      </div>
      <div className="container">
        <div className="content-acount1">
          <div className="container boxcha"></div>
          <div className="profile-fullscreen">
            <div className="account-settings-container">
              <div className="account-avatar">
                <div className="account-info fix-acount">
                  <Avatar size={128} src={avatar} alt="avatar" className="avatar" />
                  <div className="account-details">
                    <h2 className="account-name">{userProfile?.user_name || 'No name'}</h2>
                  </div>
                </div>
                <div className="account-nav">
  <div className="account-nav-item">
    <span className="account-nav-title">
      <NavLink 
        to="/profile" 
        className={({ isActive }) => isActive ? 'active-link' : ''}>
        Tài khoản
      </NavLink>
    </span>
  </div>
  <div className="account-nav-item">
    <span className="account-nav-title">
      <NavLink 
        to="/Personal" 
        className={({ isActive }) => isActive ? 'active-link' : ''}>
        Tủ phim
      </NavLink>
    </span>
  </div>
  <div className="account-nav-item">
    <span className="account-nav-title">
      <NavLink 
        to="/ticketcinema" 
        className={({ isActive }) => isActive ? 'active-link' : ''}>
        Vé
      </NavLink>
    </span>
  </div>
  <div className="account-nav-item">
    <span className="account-nav-title">
      <NavLink 
        to="/changepassword" 
        className={({ isActive }) => isActive ? 'active-link' : ''}>
        Đổi mật khẩu
      </NavLink>
    </span>
  </div>
  <div className="account-nav-item">
    <span className="account-nav-title">
      <NavLink 
        to="/test" 
        className={({ isActive }) => isActive ? 'active-link' : ''}>
        Tích Điểm
      </NavLink>
    </span>
  </div>
</div>

              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="ticket-container">
            {orders.map(order => (
              <div className="ticket" key={order.id}>
                {/* Left section of the ticket */}
                <div className="ticket-left">
                  <div className="stars-container">
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                  </div>
                  <h1 className="ticket-title">{order.showtime.movie.movie_name}</h1>
                  <div className="stars-container">
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                  </div>
                  <div className="ticket-info">
                    <div className="infofl">
                      <div className="item-ve">
                        <p><strong>Ngày :</strong> <span>{order.showtime.showtime_date.split("-").slice(1).join("/")}</span></p>
                      </div>
                      <div className="item-ve">
                        <p className='timee'><strong>Thời gian :</strong> <span>{order.showtime.showtime_start.split(":").slice(0, 2).join(":")} PM</span></p>
                      </div>
                    </div>
                    <div className="infofl">
                      <div className="item-ve">
                        <p className='screenn'><strong>Phòng:</strong><span>{order.showtime.room.room_name}</span></p>
                      </div>
                      <div className="item-ve">
                        <p className='seatt'><strong>Ghế:</strong><span>{order.seats.map((seat, index) => <span key={index}>{seat.seat_name} </span>)}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Right section of the ticket */}
                <div className="ticket-right">
                  <img src={order.qrcode} alt="QR Code" className="qr-code" />
                  <p className="admit-one">Checkin</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TicketCinema;
