import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { stripHtml } from '../../assets/Font/quillConfig';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './NewsAndReview.css';
import { useNews } from '../../Context/NewsContext';

const NewsAndReview = () => {
  const { newsData, reviewsData, isLoading, error } = useNews();
  const [visibleItems, setVisibleItems] = useState(5);
  const [showAll, setShowAll] = useState(false);

  const handleToggleItems = () => {
    setVisibleItems(showAll ? 5 : newsData.length);
    setShowAll(!showAll);
  };
  function formatTimeAgo(date: string) {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });  // Cấu hình ngôn ngữ tiếng Việt
  }

  return (
    <div className="new-container">
      <div className="news-section">
        <div className="Capnhat">
          <h2>Mới cập nhật</h2>
        </div>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div className="news-item" key={index}>
              <Skeleton width={150} height={100} />
              <div className="news-content">
                <Skeleton width="80%" height={20} />
                <Skeleton width="50%" height={15} />
                <Skeleton width="100%" height={40} />
              </div>
            </div>
          ))
        ) : (
          newsData.slice(0, visibleItems).map((news, index) => (
            <div className="news-item" key={index}>
              <img
                className="news-image-placeholder"
                src={news.thumnail || 'https://via.placeholder.com/150'}
                alt={news.title}
              />
              <div className="news-content">
                <Link to={`/postdetail/${news.slug}`}>
                  <h3>{news.title}</h3>
                </Link>
                <span>
                  <span className="user-style">{news.news_category.news_category_name}</span> -{' '}
                  {news.user.fullname} - {formatTimeAgo(news.created_at)}
                </span>
                <p>{stripHtml(news.content.substring(0, 400))}...</p>
              </div>
            </div>
          ))
        )}
        {!isLoading && newsData.length > 5 && (
          <button className="load-more-btn" onClick={handleToggleItems}>
            {showAll ? 'Ẩn bớt' : 'Xem Thêm'}
          </button>
        )}
      </div>

      <div className="review-section">
        <div className="reviewss">
          <h2>Review</h2>
        </div>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div className="review-item" key={index}>
              <Skeleton width="80%" height={20} />
              <Skeleton width="50%" height={15} />
            </div>
          ))
        ) : (
          reviewsData.slice(-5).map((review, index) => (
            <div className="review-item" key={index}>
              <Link to={`/postdetail/${review.id}`}>
                <h3>{review.title}</h3>
              </Link>
              <span>
                <span className="time">{review.user.fullname}</span> • {formatTimeAgo(review.created_at)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsAndReview;
