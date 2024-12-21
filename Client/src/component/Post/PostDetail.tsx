import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./PostDetail.css";
import Footer from "../Footer/Footer";
import Header from "../Header/Hearder";
import { NewsItem } from "../../interface/NewsItem";
import instance from "../../server";
import { extractLinks, stripHtml } from "../../assets/Font/quillConfig";
import dayjs from "dayjs";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await instance.get(`/news/${slug}`);
        setArticle(response.data.data);
  
        // Fetch related posts
        const relatedResponse = await instance.get(
          `/filterNewByMovie/${response.data.data.movie.id}`
        );
        if (relatedResponse.data.status) {
          // Lấy 7 bài viết đầu tiên
          const relatedData = relatedResponse.data.data.slice(0, 10); 
          setRelatedPosts(relatedData);
        }
        // console.log(relatedResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchArticle();
  }, [slug]);
  

  const formattedDate = article && dayjs(article.created_at).format("DD/MM/YYYY ");

  return (
    <>
      <Header />
      <div className="article-container">
        <div className="main-content">
          {loading ? (
            <>
              <Skeleton height={40} width={`60%`} style={{ marginBottom: 10 }} />
              <Skeleton height={20} width={`30%`} style={{ marginBottom: 20 }} />
              <Skeleton height={200} style={{ marginBottom: 20 }} />
              <Skeleton height={20} count={3} />
            </>
          ) : (
            <>
              <h1 className="article-title">{article?.title}</h1>
              <p className="article-meta">
                {article?.news_category.news_category_name} · {formattedDate}
              </p>

              <div className="article-content-container">
                <img
                  src={article?.movie.poster || undefined}
                  alt="Poster"
                  className="article-poster"
                />
                <div className="article-movie-info">
                  <h2>{stripHtml(article?.movie.movie_name ?? "Tên phim không khả dụng")}</h2>
                  <span>Khởi chiếu: {article?.movie.release_date ? new Date(article?.movie.release_date).toLocaleDateString("vi-VN") : "N/A"}</span>
                  <br />
                  <span className="theloaibaiviet">{article?.movie.country}</span>
                </div>
                <button className="article-button">
                  <Link to={`/movie-detail/${article?.movie.slug}`}>Mua vé ngay</Link>
                </button>
              </div>

              <p className="article-description">
                <CKEditor
                  editor={ClassicEditor}
                  data={article?.content}
                  config={{
                    toolbar: [],
                  }}
                  disabled={true}
                />
              </p>
            </>
          )}
        </div>

        <div className="card card-article">
          <div className="card-header ">
            <div className="card-header-title">
              <p>Bài viết liên quan</p>
            </div>
          </div>
          {loading ? (
            <Skeleton height={100} count={3} style={{ marginBottom: 10 }} />
          ) : (
            relatedPosts.map((post) => (
              <div className="card-body-1" key={post.id}>
                <div className="row">
                  <div className="col-auto">
                    <img
                      src={post.thumnail}
                      alt={post.title}
                      className="post-image"
                    />
                  </div>
                </div>
                <div>
                  <p className="post-meta-2">
                    <Link to={`/postdetail/${post.slug}`}>
                      {stripHtml(post.content.slice(0, 150))}...
                    </Link>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PostDetail;
