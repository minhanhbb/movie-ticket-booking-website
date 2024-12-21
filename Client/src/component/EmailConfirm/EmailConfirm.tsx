import React from "react";
import "./EmailConfirm.css";

const EmailConfirm = () => {
  return (
    <div className="email-confirm-container">
      <header className="email-confirm-header">
        <h1 className="email-confirm-event-title">eventbrite</h1>
        <p className="email-confirm-confirmation-msg">Trần Quang Huy, you're good to go</p>
        <div className="email-confirm-ticket-icon">
          <img src="https://img.icons8.com/?size=100&id=pwpz1tqVnCQy&format=png&color=000000" alt="ticket icon" />
          <p>Keep your tickets handy</p>
          <button className="email-confirm-button-get-tickets">Get the app</button>
        </div>
      </header>
      <main className="email-confirm-event-details">
  <h2 className="email-confirm-event-title">Tên phim</h2>
  
  <img src="https://venngage-wordpress.s3.amazonaws.com/uploads/2021/10/Email-Banner-Travel-Offer.png" alt="event image" className="email-confirm-event-image" />
      <div className="email-confirm-ticket-info">
        <i className="fas fa-ticket-alt"></i>
        <p>1 x Ticket</p>
      </div>
      <p className="order-total">Order total: Free</p>
      
      <div className="email-confirm-event-time-location">
        <p className="event-time">
          <i className="far fa-calendar-alt"></i>
          Thursday, October 25, 2018 from 7:00 PM to 11:00 PM (CDT)
        </p>
        <p className="email-confirm-event-links">
          <span>Add to</span>
          <a href="#">Google</a> 
          <a href="#">Outlook</a>
          <a href="#">iCal</a>
          <a href="#">Yahoo</a>
        </p>
        <p className="event-location">
          <i className="fas fa-map-marker-alt"></i>
          220 N Ada St, Chicago, IL 60607 <a href="#">(View on map)</a>
        </p>
      </div>
  <div className="email-confirm-event-links">
    <a href="#">View event details</a>
  </div>



  <div className="contact-section">
    <p>Questions about this event?</p>
    <a href="#">Contact the organizer</a>
  </div>
</main>


      <section className="email-confirm-order-summary">
        <h3>Order Summary</h3>
        <p>Order: #5A5D0C0</p>
        <p>Order placed: October 25, 2018</p>
        <p>Order total: Free</p>
        <p>Payment method: Free Order</p>
      </section>

      <footer className="email-confirm-footer">
    <p className="footer-brand">Eventbrite</p>
    <div className="email-confirm-social-links">
        <a href="#" aria-label="Instagram"><img src="https://img.icons8.com/?size=100&id=32292&format=png&color=000000" alt="Instagram" /></a>
        <a href="#" aria-label="Twitter"><img src="https://img.icons8.com/?size=100&id=8824&format=png&color=000000" alt="Twitter" /></a>
        <a href="#" aria-label="Facebook"><img src="https://img.icons8.com/?size=100&id=118468&format=png&color=000000" alt="Facebook" /></a>
    </div>
    <p>This email was sent to hello@SmilesDavis.yeah</p>
    <p>Eventbrite | 155 5th St, 7th Floor | San Francisco, CA 94103</p>
    <p>Copyright © 2018 Eventbrite. All rights reserved.</p>
</footer>

    </div>
  );
};

export default EmailConfirm;
