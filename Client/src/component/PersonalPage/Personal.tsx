import React, { useEffect, useState } from 'react';
import './Personal.css'; // Import CSS
import Footer from '../Footer/Footer';
import { Movie } from '../../interface/Movie';
import { formatDistanceToNow } from 'date-fns'; // Add date-fns library
import { useUserContext } from '../../Context/UserContext'; // Import the context
import Header from '../Header/Hearder';
import { Link } from 'react-router-dom';
import { vi } from 'date-fns/locale'; // Import ngôn ngữ tiếng Việt

const Personal: React.FC = () => {
  const { userProfile, avatar, setUserProfile, handleUpdateProfile, handleAvatarUpload } = useUserContext();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [activities, setActivities] = useState<string[]>([]); // Store recent activities
  const [visibleActivities, setVisibleActivities] = useState<string[]>([]); // Activities to show
  const [showAllActivities, setShowAllActivities] = useState(false); // Show all activities state

  useEffect(() => {
    if (userProfile) {
      const movies = userProfile.favorite_movies || [];
      setFavoriteMovies(movies);

      // Add favorite movie activities to the activity list
      const newActivities = movies.map((movie: Movie) => {
        const timeAgo = formatDistanceToNow(new Date(movie.updated_at), { addSuffix: true, locale: vi }); // Thêm locale tiếng Việt
        return `${userProfile.user_name} đã yêu thích phim: ${movie.movie_name} - ${timeAgo}`;
      });
      setActivities(newActivities);
      setVisibleActivities(newActivities.slice(0, 3)); // Display the first 3 activities
    }
  }, [userProfile]);

  const handleSeeMore = () => {
    setShowAllActivities(true);
    setVisibleActivities(activities); // Show all activities
  };

  return (
    <>
      <Header />
      <div className='main-content'>
        <div className="container">
          <div className="cardacounnt">
            <div className="cover">
              <img id="placeholder-cover" src="https://cdn.moveek.com/bundles/ornweb/img/no-cover.png" className="cover-img" alt="cover" />
            </div>
            <div className="acounntone">
              <div className='avatas'>
                <img src={avatar} alt="avatar" />
              </div>
              <div className='nameacount'>
                <h3>{userProfile?.user_name || "No name"}</h3>
              </div>
            </div>
          </div>

   


          </div>
          <div className="moveslike">
            <h3>Phim tui thích</h3>
            <div className='phimyeuthich-container'>
              <div className="phimyeuthich ">
                {favoriteMovies.length > 0 ? (
                  favoriteMovies.map((movie) => {
                    return (
                      <div className="item-phim " key={movie.id}>
                       <div className="img">
           <Link to={`/movie-detail/${movie.slug}`}> <img src={movie.poster || undefined} alt={movie.movie_name} /></Link>
</div>
                        <div className="movie-title">
            <h5>{movie.movie_name}</h5>
          </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12 text-center">Chưa có phim yêu thích nào.</div>
                )}
              </div>
            </div>
          </div>

          <div className='activities'>
            <h4 className='text-center'>Hoạt động gần đây</h4>
            <div className="activity-list">
              {visibleActivities.length > 0 ? (
                visibleActivities.map((activity, index) => (
                  <div className="activity-item" key={index}>
                    <div className="activity-info">
                      <span className="activity-dot">•</span>
                      <span className="activity-text">
                        {activity}
                      </span>
                    </div>
                    {/* <span className="activity-time">{activity}</span> */}
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">Chưa có hoạt động nào.</div>
              )}
              {!showAllActivities && activities.length > 3 && (
                <div className="see-more" onClick={handleSeeMore}>
                  Xem thêm
                </div>
              )}
            </div>
          </div>
        </div>
      
      <Footer />
    </>
  );
};

export default Personal;