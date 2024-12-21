import React, { createContext, useContext, useEffect, useState } from 'react';
import { NewsItem } from '../interface/NewsItem';
import instance from '../server';

interface NewsContextType {
  newsData: NewsItem[];
  reviewsData: NewsItem[]; // Thêm reviewsData
  isLoading: boolean;
  error: string | null;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [reviewsData, setReviewsData] = useState<NewsItem[]>([]); // Thêm state cho reviews
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const response = await instance.get('/news');
        const allNews = response.data.data || [];
        setNewsData(allNews); // Lưu toàn bộ dữ liệu tin tức
        setReviewsData(allNews.slice(-5)); // Lấy 5 tin cuối cùng cho phần review
      } catch (err: any) {
        setError(err.message || 'Failed to fetch news data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <NewsContext.Provider value={{ newsData, reviewsData, isLoading, error }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
