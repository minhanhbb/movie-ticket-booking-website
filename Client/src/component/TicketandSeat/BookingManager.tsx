import React, { useState } from "react";
import { Modal, QRCode } from "antd"; // Import modal từ antd
import "./BookingManager.css";
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";

const QuanLyVe: React.FC = () => {
  const [veDangChon, setVeDangChon] = useState<number | null>(null);
  const [hienThiModal, setHienThiModal] = useState(false);

  const danhSachVe = [
    {
      id: 1,
      rap: "CGV Vincom",
      phim: "Avatar 2",
      ngay: "2024-12-07",
      trangThai: "Đã thanh toán",
      img: "https://cdn.moveek.com/storage/media/cache/tall/6720a415a0baf290618097.jpg",
      giaTien: 150000,
      phong: "P10",
      thoigianchieu:"9:00AM"
    },
    {
      id: 2,
      rap: "BHD Star",
      phim: "Black Panther",
      ngay: "2024-12-10",
      trangThai: "Chưa thanh toán",
      img: "https://cdn.moveek.com/storage/media/cache/tall/6720a415a0baf290618097.jpg",
      giaTien: 120000,
     phong: "P10",
      thoigianchieu:"9:00AM"
    },
  ];

  const chonVe = (id: number) => {
    setVeDangChon(id);
    setHienThiModal(true);
  };

  const dongModal = () => {
    setHienThiModal(false);
  };

  return (
    <>
      <Header />
      <div className="banner">
        <h2>Lịch Sử Mua Vé </h2>
        <p>
          Danh sách các phim hiện đang chiếu rạp trên toàn quốc 24/10/2024. Xem lịch chiếu phim, giá vé tiện lợi, đặt vé nhanh chỉ với 1 bước!
        </p>
      </div>
      <div className="ung-dung-ve">
        <div className="khung-noi-dung">
          <main className="lich-su-ve">
            <h3>Lịch Sử Mua Vé</h3>
            <div className="quan-ly-ve">
              <div className="bo-loc-ve">
                <select>
                  <option value="">Tất cả rạp</option>
                  <option value="cgv">CGV</option>
                  <option value="bhd">BHD Star</option>
                </select>
                <select>
                  <option value="">Tất cả trạng thái</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="unpaid">Chưa thanh toán</option>
                </select>
              </div>
              <div className="danh-sach-ve">
                {danhSachVe.map((ve) => (
                  <div
                    key={ve.id}
                    className={`ve-item ${
                      veDangChon === ve.id ? "dang-chon-ve" : ""
                    }`}
                    onClick={() => chonVe(ve.id)}
                  >
                    <img src={ve.img} alt={ve.phim} className="hinh-ve" />
                    <div className="ten-phim">{ve.phim}</div>
                    <div className="rap-chieu">{ve.rap}</div>
                    <div className="ngay-chieu">{ve.ngay}</div>
                    <div
                      className={`trang-thai-ve ${
                        ve.trangThai === "Đã thanh toán"
                          ? "da-thanh-toan-ve"
                          : "chua-thanh-toan-ve"
                      }`}
                    >
                      {ve.trangThai}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal hiển thị chi tiết vé */}
      <Modal
  title="Chi tiết vé"
  open={hienThiModal}
  onCancel={dongModal}
  footer={null}
  className="custom-modal"
>
  {veDangChon && (
    <>
      <div className="contentt">
        <img
          src={danhSachVe[veDangChon - 1].img}
          alt={danhSachVe[veDangChon - 1].phim}
        />
        <div className="info">
          <p>Rạp: {danhSachVe[veDangChon - 1].rap}</p>
          <p>Phim: {danhSachVe[veDangChon - 1].phim}</p>
          <p>Thời gian: {danhSachVe[veDangChon - 1].thoigianchieu}</p>
          <p>Phòng: {danhSachVe[veDangChon - 1].phong}</p>
          <p>Ngày: {danhSachVe[veDangChon - 1].ngay}</p>
          <p>Giá tiền: {danhSachVe[veDangChon - 1].giaTien.toLocaleString()} VND</p>
          <p>Trạng thái: {danhSachVe[veDangChon - 1].trangThai}</p>
        </div>
      </div>

      <div className="qr-code-container">
        <QRCode value={`Mã vé: ${danhSachVe[veDangChon - 1].id}`} size={150} />
      </div>
    </>
  )}
</Modal>


      <Footer />
    </>
  );
};

export default QuanLyVe;
