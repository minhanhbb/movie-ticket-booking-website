import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { stripHtml } from '../../assets/Font/quillConfig';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './NewsContent.css';
import { useNews } from '../../Context/NewsContext';

const NewsContent = () => {
  const { newsData, isLoading, error } = useNews();

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  function formatTimeAgo(date:string) {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
  }

  return (
    <div className="news-container">
    
        <>
          <div className="main-news">
            <div className="main-news-image">
              {isLoading ? (
                <Skeleton height={400} />
              ) : (
                <Slider {...settings}>
                  {newsData.slice(0, 3).map((news, index) => (
                    <div key={index}>
                      <Link to={`/postdetail/${news.slug}`}>
                        <img
                          src={news.banner || 'https://via.placeholder.com/800x400'}
                          alt={news.title}
                        />
                      </Link>
                    </div>
                  ))}
                </Slider>
              )}
            </div>
            <div className="main-news-content">
              <h2 className="PhimHot">
                {isLoading ? <Skeleton width="50%" /> : 'Phim Hot Trong Tuần'}
              </h2>
            </div>
          </div>
          <div className="related-news">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div className="related-news-item" key={index}>
                    <Skeleton width="70%" height={20} />
                    <Skeleton width="50%" height={15} />
                  </div>
                ))
              : newsData.slice(1, 6).map((news, index) => (
                  <div className="related-news-item" key={index}>
                    <Link to={`/postdetail/${news.slug}`} className="title">
                      {stripHtml(news.title)}
                    </Link>
                    <span className="author">
                      <span className="user-style">{news.user.fullname}</span> •{' '}
                      {news.news_category.news_category_name} • {formatTimeAgo(news.created_at)}
                    </span>
                  </div>
                ))}
          </div>
        </>
     
    </div>
  );
};

export default NewsContent;
