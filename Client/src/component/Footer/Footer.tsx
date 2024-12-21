import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
        <div className="footer-left">
            <img src="../../../public/logo.jpg" alt="Company Logo" className="company-logo-ct" />
            <div className="company-info">
            <p><strong>CÔNG TY MOVIE CINEMA FLICKHIVE</strong></p>
                <p>Số ĐKKD: 0315367026 · Nơi cấp: Sở kế hoạch và đầu tư Tp. Hà Nội</p>
                <p>Đăng ký lần đầu ngày 15/09/2024</p>
                <p>Địa chỉ: Trịnh Văn Bô - Bắc Từ Liêm - Hà Nội</p>
                <div className="footer-links">
                    <a href="#">Về chúng tôi</a>  
                    <a href="#">Chính sách bảo mật</a> 
                    <a href="#">Hỗ trợ</a> 
                    <a href="#">Liên hệ</a> 
                
                </div>
            </div>
        </div>
        <div className="footer-right">
        <p>Đối Tác</p>
            <div className="partners">
                <img src="https://cdn.moveek.com/bundles/ornweb/partners/beta-cineplex-v2.jpg" alt="Beta Cinemas" />
                <img src="https://cdn.moveek.com/bundles/ornweb/partners/mega-gs-cinemas.png" alt="Mega GS" />
                <img src="https://cdn.moveek.com/bundles/ornweb/partners/cinestar.png" alt="Cinestar" />
                <img src="https://cdn.moveek.com/bundles/ornweb/partners/dcine.png" alt="DCINE" />
                <img src="https://cdn.moveek.com/bundles/ornweb/partners/starlight.png" alt="Starlight" />
                <img src="https://cdn.moveek.com/bundles/ornweb/partners/dong-da-cinemas.png" alt="DDC" />
            </div>
            <div className="partners-2">
            <img src="https://cdn.moveek.com/bundles/ornweb/partners/touch-cinemas.png" alt="Touch Cinema" />
                <img src="https://cdn.moveek.com/bundles/ornweb/partners/payoo.jpg" alt="Payoo" />
                <img src="https://cdn.moveek.com/bundles/ornweb/partners/momo.png" alt="MoMo" />
                <img src="https://cdn.moveek.com/bundles/ornweb/partners/shopeepay-icon.png" alt="Shopee" />
                <img src="https://cdn.moveek.com/bundles/ornweb/partners/zalopay-icon.png" alt="ZaloPay" />
                <img src="https://cdn.moveek.com/bundles/ornweb/partners/fundiin-icon.png" alt="Fundin" />
            </div>
        </div>
        <div className="partners-3">
            <img src="https://cdn.moveek.com/bundles/ornweb/img/20150827110756-dathongbao.png" alt="Bộ Công Thương" />
            </div>
    </footer>
    
    );
};

export default Footer;