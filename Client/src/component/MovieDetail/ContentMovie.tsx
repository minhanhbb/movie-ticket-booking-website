import React, { useEffect, useState } from 'react';
import './MovieDetail.css';
import './ContentMovie.css';
import MovieDetail from './MovieDetail';
import Footer from '../Footer/Footer';
import { Link, useNavigate, useParams } from 'react-router-dom';  // Import useParams
import instance from '../../server'; // Ensure you import the API instance correctly
import { Movie } from '../../interface/Movie'; // Import Movie interface
import { useCountryContext } from '../../Context/CountriesContext';
import { stripHtml } from '../../assets/Font/quillConfig';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';  // Import tiếng Việt từ date-fns
interface Props {}

export const ContentMovie = (props: Props) => {
    const { slug } = useParams(); // Get the movieId from the route parameter
    const movieId = slug ? parseInt(slug) : null; // Parse the id to an integer
    const [ratings, setRatings] = useState<any[]>([]);  // State để lưu danh sách đánh giá
    const [movie, setMovie] = useState<Movie | null>(null); // Initialize state for the movie
    const { state, fetchCountries } = useCountryContext();

    // const [selectedLocation, setSelectedLocation] = useState<string>(''); // Initialize state for the selected location
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]); // Initialize state for related posts
    const [loading, setLoading] = useState<boolean>(true);  // Trạng thái tải
    const [error, setError] = useState<string | null>(null);  // Trạng thái lỗi
    const navigate = useNavigate();
    function formatTimeAgo(date: string) {
        return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });  // Cấu hình ngôn ngữ tiếng Việt
      }
    useEffect(() => {
        const fetchMovieDetails = async () => {
            if (slug) {
                try {
                    const response = await instance.get(`/movies/${slug}`); // Fetch movie details
                    setMovie(response.data.data.original); // Store the movie data in state
                } catch (error) {
                    console.error("Error fetching movie details:", error);
                }
            }
        };

        fetchMovieDetails(); // Fetch movie details when movieId changes
    }, [movieId]); // Fetch movie details when movieId changes

    useEffect(() => {
        fetchCountries(); // Gọi fetchCountries khi component mount
      }, [fetchCountries]);
    useEffect(() => {
        if (movie?.id) {
            setLoading(true);
            instance
                .get(`/ratings/${movie?.id}`)  // Thay đổi từ fetch thành instance.get
                .then((response) => {
                    if (response.data.status) {
                        setRatings(response.data.data);  // Lưu đánh giá vào state
                    } else {
                        // setError("Không có đánh giá cho phim này.");
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    // setError(error.message);
                    setLoading(false);
                });
        } else {
            setError("ID phim không tồn tại.");
            setLoading(false);
        }
    }, [slug]);
    useEffect(() => {
        const fetchRelatedPosts = async () => {
            if (movie?.id) {
                try {
                    const response = await instance.get(`/filterNewByMovie/${movie?.id}`); 
                    if (response.data?.status) {    
                        setRelatedPosts(response.data.data);
                    }
                } catch (error) {
                    // console.error("Error fetching related posts:", error);
                }
            }
        };

        fetchRelatedPosts(); // Fetch related posts when movieId is available
    }, [movie?.id]);

    // const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     setSelectedLocation(e.target.value); // Update selected location
    // };

   

  
  
    // const handleViewSchedule = () => {
    //   if (selectedLocation) {
    //     navigate(`/schedule/${movie?.slug}`, { state: { selectedLocation } });
    //   } else {
    //     alert("Vui lòng chọn khu vực trước khi xem lịch chiếu!");
    //   }
    // };

    return (
        <div>
            <MovieDetail />
            <div className="content">
                <div className="container content-1">
                    <div className="video-section">
                        <iframe
                            width="735px"
                            height="400"
                            src={movie?.trailer || 'https://www.youtube.com/embed/defaultVideo'}
                            title={movie?.movie_name || "Movie Trailer"}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Select location and view schedule */}
                    {/* <div className="schedule-section">
                        <h3>Lịch chiếu</h3>
                        <p>Chọn khu vực bạn muốn xem lịch chiếu cho phim <strong>{movie?.movie_name}</strong>.</p>

                        <div className="schedule-actions">
                            <select
                                className="city-select"
                                value={selectedLocation}
                                onChange={handleLocationChange}
                            >
                                {state.countries.map((location) => (
                                    <option key={location.id} value={location.id.toString()}>
                                        {location.location_name}
                                    </option>
                                ))}
                            </select>
                            <button className="button xem-lich-chieu" onClick={handleViewSchedule}>Xem lịch chiếu</button>
                        </div>
                    </div> */}

                    {/* Related posts section */}
                    <div className="title-2">
                        <h3>Bài viết liên quan</h3>
                    </div>
                    <div className="related-posts">
                        <div className="newcontent">
                            {relatedPosts.map((post) => (
                                <div className="post" key={post.id}>
                                    <img
                                        src={post.thumnail}
                                        alt={post.title}
                                        className="post-image"
                                    />
                                    {/* {post.user_id} • */}
                                    <div className="post-info">
                                       <Link className="post-title" to={`/postdetail/${post.slug}`}>{post.title}</Link>
                                        <p className="post-meta"><span className="post-meta-span">Đánh giá phim</span>    {formatTimeAgo(post.created_at)}</p>
                                        <p className="post-meta-2">{stripHtml(post.content.slice(0, 150))}...</p> {/* Display a truncated version of the content */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    
                </div>
            </div>
            <Footer />
        </div>
    );
};
