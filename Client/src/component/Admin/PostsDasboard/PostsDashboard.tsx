import React, { useEffect, useState } from 'react';
import { usePostsContext } from '../../../Context/PostContext';
import { Link } from 'react-router-dom';
import { NewsItem } from '../../../interface/NewsItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Button, Input, notification } from 'antd';
import { Switch } from 'antd';
import instance from '../../../server';

const PostsDashboard: React.FC = () => {
  const { state, deletePost,dispatch } = usePostsContext();
  const { posts } = state;
  const { Search } = Input;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const postsPerPage = 6;
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Filter posts by title
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const handleDeletePost = async (postId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      await deletePost(postId);
      notification.success({
        message: 'Xóa bài viết thành công!',
        description: 'Bài viết đã được xóa thành công.',
        placement: 'topRight', // Vị trí của thông báo
      });
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Show a truncated version of the content
  const truncateContent = (content: string, length: number) => {
    if (content.length <= length) return content;
    return `${content.slice(0, length)}...`;
  };
  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };
  const handleStatusChange = async (id: number, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus; // Đảo ngược trạng thái hiện tại
      await instance.post(`/manager/newStatus/${id}`, { status: newStatus }); // Gửi API để cập nhật trạng thái
  
      // Cập nhật trạng thái trong context hoặc state (nếu cần)
      dispatch({
        type: 'UPDATE_POST_STATUS',
        payload: { id, status: newStatus ? 1 : 0 }, // Gửi 1 hoặc 0 cho API
      });
  
      // Thông báo thành công
      notification.success({
        message: 'Cập Nhật Thành Công',
        description: `Trạng thái bài viết đã được${newStatus ? ' Hiện' : ' Ẩn'}.`,
      });
    } catch (err) {
      // Thông báo lỗi
      notification.error({
        message: 'Lỗi Cập Nhật',
        description: 'Không thể cập nhật trạng thái bài viết. Vui lòng thử lại.',
      });
    }
  };
  

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to={'/admin/posts/add'} >
        <Button type="primary" size="large">
                        Thêm bài viết
                    </Button>
        </Link>
        <Search
                    placeholder="Tìm kiếm theo tên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {currentPosts.length > 0 ? (
          currentPosts.map((post: NewsItem) => (
            <div key={post.id} className="col">
              <div className="card shadow border-0 h-100">
                <Link to={`/admin/posts/${post.id}`} className="card-img-top-link">
                  <img src={post.thumnail} className="card-img-top" alt={post.title} />
                </Link>
                <div className="card-body d-flex flex-column">
                  <Link to={`/admin/posts/${post.id}`} className="card-title-link">
                    <h5 className="card-title text-dark font-weight-bold">{post.title}</h5>
                  </Link>
                  <p className="text-muted small mt-auto mb-2">Thể loại: {post.news_category.news_category_name}</p>
                  <p className="text-muted small mt-auto mb-2">Lượt Xem: {post.views}</p>
                  <p className="text-muted small mb-3">Ngày xuất bản: {new Date(post.created_at).toLocaleDateString()}</p>
                  <p><Switch
  checked={post.status ===1} // Trạng thái hiện tại từ API
  checkedChildren="Hiện"
  unCheckedChildren="Ẩn"
  onChange={() => handleStatusChange(post.id, post.status===1)} // Gọi hàm khi trạng thái thay đổi
/></p>
                  <div className="d-flex justify-content-between mt-auto">
  <Link to={`/admin/posts/edit/${post.id}`} className="btn btn-warning rounded-pill btn-sm px-3">
    <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
  </Link>
  <button className="btn btn-danger rounded-pill btn-sm px-3" onClick={() => handleDeletePost(post.id)}>
    <FontAwesomeIcon icon={faTrash} /> Xóa
  </button>
</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>Không có bài viết nào.</p>
          </div>
        )}
      </div>

      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Trước</button>
          </li>
          {renderPagination().map((page, index) => (
            <li key={index} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              <button
                className="page-link"
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={typeof page !== 'number'}
              >
                {page}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Sau</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PostsDashboard;
