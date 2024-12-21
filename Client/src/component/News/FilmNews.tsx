import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from "../Footer/Footer";
import Header from "../Header/Hearder";
import { stripHtml } from '../../assets/Font/quillConfig';
import './FilmNews.css';
import { useNews } from '../../Context/NewsContext';

function FilmNews() {
  const { newsData,  error } = useNews();  // Lấy dữ liệu từ context

  if (error) {
    return <div className="error">Error: {error}</div>;  // Xử lý lỗi nếu có
  }

  return (
    <>
  
        <>
          <Header />
          <div className="Contentseach">
            <div className="banner-movies">
              <h2>Tin Điện Ảnh</h2>
              <div className="text-white mt-0 description">
                Tin tức điện ảnh Việt Nam & thế giới
              </div>
            </div>
            <div className="container box-cha2">
              <div className="row boxcha-4">
                <div className="tintucmoi col-lg-8 col-md-10 col-sm-12">
                  <h2>Mới Nhất</h2>
                  
                  {newsData.map((item) => (
                    <div key={item.id} className="div-item">
                      <div className="img">
                        <img src={item.thumnail} alt={item.title} />
                      </div>
                      <div className="content-new">
                        <Link to={`/postdetail/${item.slug}`}><h3>{item.title}</h3></Link>
                        <p>{stripHtml(item.content)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="chuyenmuc col-lg-4 col-md-2 col-sm-12">
                  <h3>Chuyên mục</h3>
                  <div className="noidung">
                   <Link to={'/community'}><h4>Đánh giá phim</h4></Link>
                    <p>Góc nhìn chân thực, khách quan nhất về các bộ phim</p>
                  </div>
                  <div className="noidung">
                    <h4>Tin điện ảnh</h4>
                    <p>Tin tức điện ảnh Việt Nam & thế giới</p>
                  </div>
                  <div className="noidung">
                   <Link to={'/video'}> <h4>Video - Trailer</h4></Link>
                    <p>Trailer, video những phim chiếu rạp và truyền hình hot nhất</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
     
    </>
  );
}
           

export default FilmNews;

