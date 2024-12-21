import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './CinemaList.module.css';
import Header from '../Header/Hearder';
import Footer from '../Footer/Footer';
import instance from '../../server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Cinema } from '../../interface/Cinema';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton

const CinemaList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id !== null) {
      setLoading(true);
      instance
        .get(`/cinema-by-location/${id}`)
        .then((response) => {
          setCinemas(response.data.data);
          // console.log(response.data);
        })
        .catch(() => setError('Không thể tải dữ liệu rạp chiếu.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const filteredCinemas = cinemas.filter((cinema) =>
    cinema.cinema_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCinemaClick = (cinemaId: number | undefined) => {
    navigate(`/cinema/${cinemaId}`); // Chuyển hướng tới trang rạp và truyền cinemaId
  };

  return (
    <>
      <Header />
      <div className="banner-movies">
        <h2>Danh sách rạp</h2>
        <div className="text-white mt-0 description">
          Rạp chiếu phim khu vực bạn đã chọn
        </div>
      </div>

      <div className={styles.cinemaContainer}>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm rạp chiếu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && (
          <ul className={styles.cinemaList}>
            {[...Array(5)].map((_, index) => (
              <li key={index} className={styles.cinemaItem}>
                <Skeleton height={100} width={100} circle={true} />
                <div>
                  <Skeleton width={200} height={25} />
                  <Skeleton width={150} height={20} />
                </div>
              </li>
            ))}
          </ul>
        )}
        
        {error && <p className={styles.errorMessage}>{error}</p>}
        
        {!loading && !error && (
          <ul className={styles.cinemaList}>
            {filteredCinemas.map((cinema) => (
              <li key={cinema.id} className={styles.cinemaItem}>
                <img
                  src="../../../public/logo.jpg"
                  alt={cinema.cinema_name}
                  className={styles.cinemaLogo}
                />
                <div>
                  <h3
                    className={styles.cinemaName}
                    onClick={() => handleCinemaClick(cinema.id)}
                  >
                    {cinema.cinema_name}{' '}
                    <span className={styles.ticketBadge}>bán vé</span>
                  </h3>
                  <p className={styles.cinemaAddress}>{cinema.cinema_address}</p>
                </div>
              </li>
            ))}
            {filteredCinemas.length === 0 && (
              <p>Không tìm thấy rạp chiếu nào.</p>
            )}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CinemaList;
