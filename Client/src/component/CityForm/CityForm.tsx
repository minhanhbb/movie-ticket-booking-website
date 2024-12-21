import React, { useState, useEffect } from 'react';
import './CityForm.css';
import { useNavigate } from 'react-router-dom';
import { useCountryContext } from '../../Context/CountriesContext';


interface CityFormProps {
  isVisible: boolean;
  onClose: () => void;
}

const CityForm: React.FC<CityFormProps> = ({ isVisible, onClose }) => {
  const [search, setSearch] = useState('');
  const { state, fetchCountries } = useCountryContext(); // Get state and fetchCountries function from context
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch data when the component becomes visible
  useEffect(() => {
    if (isVisible) {
      setLoading(true);
      try {
        fetchCountries(); // Trigger fetch from context (already fetches data in useEffect of context provider)
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    }
  }, [isVisible, fetchCountries]);

  const handleCityClick = (id: string) => {
    navigate(`/cinemalist/${id}`);
  };

  // Filter cities based on the search input
  const filteredCities = state.countries.filter((city:any) =>
    city.location_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Lớp phủ ngoài */}
      {isVisible && (
        <div
          className="city-form-overlay"
          onClick={onClose} // Gọi hàm onClose khi click vào overlay
        ></div>
      )}

      {/* Form chính */}
      {isVisible && (
        <div className="city-form-container">
          <div className="city-form">
            {/* Ô tìm kiếm */}
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm theo tỉnh, thành phố"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <i className="fas fa-search search-icon"></i>
            </div>

            {/* Trạng thái tải dữ liệu */}
            {loading && <p>Đang tải dữ liệu...</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Danh sách các tỉnh/thành phố */}
            <ul className="city-list">
              {filteredCities.map((city:any, index:any) => (
                <li key={index} className="city-item">
                  <div
                    className="city-name"
                    onClick={() => handleCityClick(city.id)} // Điều hướng khi bấm vào tên
                  >
                    {city.location_name}
                  </div>
                  <div className="city-theaters">{city.cinema_count} rạp</div>
                </li>
              ))}
              {filteredCities.length === 0 && <p>Không tìm thấy kết quả.</p>}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default CityForm;
