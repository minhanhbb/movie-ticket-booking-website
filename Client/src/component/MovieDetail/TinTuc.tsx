import React, { useEffect, useState } from "react";
import "./TinTuc.css";
import Footer from "../Footer/Footer";
import MovieDetail from "./MovieDetail";
import instance from "../../server";
import { stripHtml } from '../../assets/Font/quillConfig';
import { useMovieContext } from "../../Context/MoviesContext";
import { Link, useParams } from "react-router-dom";

// Skeleton Loading Component
const SkeletonLoading = () => (
    <div className="skeleton-container">
        <div className="skeleton-header" />
        <div className="skeleton-post-list">
            {[...Array(3)].map((_, index) => (
                <div className="skeleton-post" key={index}>
                    <div className="skeleton-image" />
                    <div className="skeleton-text" />
                    <div className="skeleton-meta" />
                </div>
            ))}
        </div>
    </div>
);

const TinTuc: React.FC = () => {
    const { slug } = useParams(); // Sử dụng slug
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    const { state } = useMovieContext(); // Lấy dữ liệu từ MovieContext
    const movie = state.movies.find((movie) => movie.slug === slug);

    useEffect(() => {
        if (movie?.id) {
            // Fetch data from the API
            setLoading(true); // Start loading
            instance.get(`/filterNewByMovie/${movie.id}`)
                .then(response => {
                    if (response.data.status) {
                        setRelatedPosts(response.data.data);
                    } else {
                        setRelatedPosts([]); // No related posts found
                    }
                    setLoading(false); // Stop loading
                })
                .catch(error => {
                    setError("There was an error fetching the related posts.");
                    setLoading(false); // Stop loading
                });
        }
    }, [movie?.id]);

    return (
        <>
            <div>
                <MovieDetail />
                <div className="content">
                    <div className="container tintuccontainer">
                        <div className="title-2">
                            <h3>Bài viết liên quan</h3>
                        </div>
                        <div className="related-posts">
                            <div className="newcontent">
                                {loading ? (
                                    // Display Skeleton Loading for the whole content
                                    <SkeletonLoading />
                                ) : error ? (
                                    <p>{error}</p>
                                ) : relatedPosts.length === 0 ? (
                                    // Display message if no related posts
                                    <p>Không có bài viết liên quan đến phim này.</p>
                                ) : (
                                    relatedPosts.map((post) => (
                                        <div className="post" key={post.id}>
                                            <img
                                                src={post.thumnail}
                                                alt={post.title}
                                                className="post-image"
                                            />
                                            <div className="post-info">
                                                <a href="#" className="post-title">
                                                    <Link to={`/postdetail/${post.slug}`}>{post.title}</Link>
                                                </a>
                                                <p className="post-meta">
                                                    Đánh giá phim • {post.user.user_name} • {new Date(post.created_at).toLocaleDateString()}
                                                </p>
                                                <p className="post-meta-2">
                                                    {stripHtml(post.content.slice(0, 150))}...
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default TinTuc;
