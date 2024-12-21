import React, { useEffect, useState } from 'react';
import Header from '../Header/Hearder';
import { Avatar, QRCode } from 'antd';
import instance from '../../server';
import Footer from '../Footer/Footer';
import './MovieTicket.css';
import Ticket from '../../interface/Ticket';
import { NavLink } from 'react-router-dom';


// Define the Seat interface


const MovieTicket = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]); // Use the Ticket type here
  const [avatar, setAvatar] = useState('https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png');
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const profileData = localStorage.getItem('user_profile');
    if (profileData) {
      const profile = JSON.parse(profileData);
      const userId = profile.id;

      const fetchUserProfile = async () => {
        try {
          const response = await instance.get(`/user/${userId}`);
          if (response.data.status) {
            setUserProfile(response.data.data);
            setAvatar(response.data.data.avatar || 'https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png');
            // console.log("phim da dat",response);
            
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      const fetchTickets = async () => {
        try {
          const response = await instance.get(`/order/${userId}`);
          if (response.data.status) {
            const ticketData = response.data.data;
           
            
            setTickets(ticketData ? [ticketData] : []);
          }
          // console.log("ve",response);
        } catch (error) {
          console.error('Error fetching tickets:', error);
        }
      };

      fetchUserProfile();
      fetchTickets();
    }
  }, []);

  return (
    <>
      <Header />
      <div className="banner">
        <img src="https://cdn.moveek.com/bundles/ornweb/img/tix-banner.png" alt="Banner" className="banner-img" />
      </div>
      <div className="container">
        <div className="content-acount1">
          <div className="container boxcha">
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
        <NavLink 
          to="/profile" 
          className={({ isActive }) => `account-nav-title ${isActive || location.pathname === '/changepassword' ? 'active' : ''}`}
        >
          Tài khoản
        </NavLink>
        <ul className="account-submenu">
          <li className="account-submenu-item">
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>Quản lí tài khoản</NavLink>
          </li>
          <li className="account-submenu-item">
            <NavLink to="/changepassword" className={({ isActive }) => (isActive ? 'active' : '')}>Đổi mật khẩu</NavLink>
          </li>
        </ul>
      </div>

      <div className="account-nav-item">
        <NavLink 
          to="/movie-library" 
          className={({ isActive }) => `account-nav-title ${isActive ? 'active' : ''}`}
        >
          Tủ phim
        </NavLink>
      </div>

      <div className="account-nav-item">
        <NavLink 
          to="/tickets" 
          className={({ isActive }) => `account-nav-title ${isActive ? 'active' : ''}`}
        >
          Vé
        </NavLink>
      </div>

      <div className="account-nav-item">
        <NavLink 
          to="/credits" 
          className={({ isActive }) => `account-nav-title ${['/credits', '/deponsit', '/transaction'].includes(location.pathname) ? 'active' : ''}`}
        >
          Nạp tiền
        </NavLink>
        <ul className="account-submenu">
          <li className="account-submenu-item">
            <NavLink to="/credits" className={({ isActive }) => (isActive ? 'active' : '')}>Nạp tiền</NavLink>
          </li>
          <li className="account-submenu-item">
            <NavLink to="/deponsit" className={({ isActive }) => (isActive ? 'active' : '')}>Lịch sử nạp tiền</NavLink>
          </li>
          <li className="account-submenu-item">
            <NavLink to="/transaction" className={({ isActive }) => (isActive ? 'active' : '')}>Lịch sử giao dịch</NavLink>
          </li>
        </ul>
      </div>
    </div>
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="ticket-tong">
              {tickets.length === 0 ? (
                <p className="no-tickets-message">Bạn chưa có vé nào được đặt.</p>
              ) : (
                tickets.map((ticket, index) => (
                  <div className="ticket-container" key={index}>
                    <p className="ticket-code">Mã đặt vé - {ticket.id}</p>
                    <h2 className="ticket-cinema">{ticket.showtime?.room?.cinema_name || 'N/A'}</h2>
                    <p className="ticket-date">{ticket.showtime?.showtime_date}</p>
                    <div className="ticket-info">
                      <span className="ticket-time">{ticket.showtime?.showtime_start}</span>
                      <span className="ticket-room">{ticket.showtime?.room?.room_name}</span>
                      <span className="ticket-seat">
                        {ticket.seats.map((seat) => (
                          <span key={seat.seat_name}>{seat.seat_name}</span>
                        ))} 
                      </span>
                    </div>
                    <div className="ticket-details">
                      <div className="ticket-item">
                        <span className="item-name">Số lượng</span>
                        <span className="item-quantity">{ticket.seats?.length || 0}</span>
                        <span className="item-price">{ticket.amount?.toLocaleString()} VND</span>
                      </div>
                      <div className="ticket-item">
                        <span className="item-name">Combo:</span>

                        <span className="item-quantity"> {ticket.combos?.map((combos, index) => (
                          <span key={index}>{combos.combo_name}</span>
                        ))}</span>
                        <span className="item-price"></span>
                      </div>
                      <div className="ticket-item total">
                        <span className="item-name">TỔNG</span>
                        <span className="item-price">{ticket.amount?.toLocaleString()} VND</span>
                      </div>
                    </div>
                    <div className="ticket-qr">
                      <QRCode value={JSON.stringify(ticket)} size={128} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MovieTicket;
