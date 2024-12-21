import React, { useEffect, useState } from 'react';
import { useMovieContext } from '../../../Context/MoviesContext';
import { Link } from 'react-router-dom';
import instance from '../../../server';
import { Movie } from '../../../interface/Movie';
import { notification, Table, Pagination, Input, Button, Popconfirm, Modal } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import { Showtime } from '../../../interface/Showtimes';
import { Room } from '../../../interface/Room';

const MoviesDashboard: React.FC = () => {
    const { state, dispatch } = useMovieContext();
    const { movies } = state;
    const { Search } = Input;
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [moviesPerPage] = useState<number>(5);
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [showtimeModalVisible, setShowtimeModalVisible] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const fetchShowtimes = async (movieId: number) => {
        try {
            // Gọi API để lấy suất chiếu theo movieId
            const response = await instance.get('/manager/showtimes', {
                params: { movie_id: movieId },
            });
    
            // Lọc dữ liệu showtimes để chỉ chứa các suất chiếu của phim đã chọn
            const filteredShowtimes = response.data.data.data.filter((showtime: Showtime) => showtime.movie_id === movieId);
            
            // Cập nhật trạng thái showtimes chỉ với suất chiếu của phim đã chọn
            setShowtimes(filteredShowtimes);
            
            // Mở modal để hiển thị showtimes của phim
            setShowtimeModalVisible(true);
        } catch (error) {
            console.error('Lỗi khi lấy suất chiếu:', error);
        }
    };
    
    // Khi click vào ảnh, truyền movie.id vào hàm fetchShowtimes để lấy dữ liệu suất chiếu của phim cụ thể
    const handleImageClick = (movie: Movie) => {
        setSelectedMovie(movie);
        fetchShowtimes(movie.id); // Lấy suất chiếu của phim khi click vào ảnh
    };
    

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const movieResponse = await instance.get('/manager/movies');
                dispatch({ type: 'SET_MOVIES', payload: movieResponse.data.data.original });
            } catch (error) {
                console.error('Error fetching movies:', error);
                setError('Không thể tải phim');
            }
        };

        fetchMovies();
    }, [dispatch]);

    // Delete movie
    const deleteMovie = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phim này không?')) {
            try {
                await instance.delete(`/manager/movies/${id}`);
                dispatch({ type: 'DELETE_MOVIE', payload: id });
                notification.success({
                    message: 'Xóa Phim',
                    description: 'Đã xóa phim thành công!',
                    placement: 'topRight',
                });
            } catch (error) {
                console.error('Error deleting movie:', error);
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể xóa phim.',
                    placement: 'topRight',
                });
            }
        }
    };

    // Filtered movies based on search term
    const filteredMovies = Array.isArray(movies)
        ? movies.filter(movie =>
              movie.movie_name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    // Update movie status (show/hide)
    const updateMovieStatus = async (id: number, currentStatus: boolean) => {
        try {
            const newStatus = !currentStatus;
            await instance.post(`/manager/movieStatus/${id}`, { status: newStatus ? 1 : 0 });
            dispatch({
                type: 'UPDATE_MOVIE_STATUS',
                payload: { id, status: newStatus ? 1 : 0 },
            });
            notification.success({
                message: 'Cập Nhật Trạng Thái',
                description: `Phim đã được ${newStatus ? 'hiện' : 'ẩn'}.`,
                placement: 'topRight',
            });
        } catch (error) {
            console.error('Error updating movie status:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể cập nhật trạng thái phim.',
                placement: 'topRight',
            });
        }
    };

    // Table columns for movies
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            className: 'text-center',
        },
        {
            title: 'Ảnh',
            dataIndex: 'poster',
            key: 'poster',
            render: (poster: string, movie: Movie) => (
                <img
                    src={poster}
                    alt="Poster"
                    style={{ width: '100px', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => handleImageClick(movie)} // Open showtimes modal on image click
                />
            ),
            className: 'text-center',
        },
        {
            title: 'Thông Tin Phim',
            key: 'movie_info',
            render: (movie: Movie) => (
                <div>
                    <p><strong>Tên phim :</strong> {movie.movie_name}</p>
                    <p><strong>Thời Lượng:</strong> {movie.duration} phút</p>
                    <p><strong>Giới Hạn Tuổi:</strong> {movie.age_limit}+</p>
                    <p><strong>Quốc gia:</strong> {movie.country}</p>
                    <p><strong>Ngày Công Chiếu:</strong> 
                        {movie.release_date
                            ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(movie.release_date))
                            : 'Chưa cập nhật'}
                    </p>
                </div>
            ),
            className: 'text-left',
        },
        {
            title: 'Trạng Thái',
            key: 'status',
            render: (movie: Movie) => (
                <div style={{ textAlign: 'left' }}>
                    <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        checked={movie.status === 1}
                        onChange={() => updateMovieStatus(movie.id, movie.status === 1)}
                    />
                </div>
            ),
            className: 'text-left',
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (text: any, movie: any) => (
                <div className="d-flex justify-content-around">
                    <Link to={`/admin/movies/edit/${movie.id}`}>
                        <Button type="primary" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa phim này?"
                        onConfirm={() => deleteMovie(movie.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
            className: 'text-center',
        },
    ];

    // Showtimes table columns
    const showtimeColumns = [
        {
            title: 'Phim',
            dataIndex: ['movie', 'movie_name'],
            key: 'movie_name',
        },
        {
            title: 'Phòng',
            dataIndex: ['room', 'room_name'],
            key: 'room_name',
        },
        {
            title: 'Ngày',
            dataIndex: 'showtime_date',
            key: 'showtime_date',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Giờ bắt đầu',
            dataIndex: 'showtime_start',
            key: 'showtime_start',
        },
        {
            title: 'Giờ kết thúc',
            dataIndex: 'showtime_end',
            key: 'showtime_end',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => (price),
        },
    ];

    const handlePageChange = (page: number) => setCurrentPage(page);

    const totalMovies = filteredMovies.length;
    const currentMovies = filteredMovies.slice(
        (currentPage - 1) * moviesPerPage,
        currentPage * moviesPerPage
    );

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/movies/add'}>
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                        Thêm Phim Mới
                    </Button>
                </Link>
                <Search
                    placeholder="Tìm kiếm theo tên phim"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={currentMovies}
                rowKey="id"
                pagination={false}
                locale={{
                    emptyText: 'Không có phim nào.',
                }}
            />
            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    current={currentPage}
                    total={totalMovies}
                    pageSize={moviesPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total) => `Tổng số ${total} phim`}
                />
            </div>
            <Modal
                title={`Suất chiếu của phim ${selectedMovie?.movie_name}`}
                visible={showtimeModalVisible}
                onCancel={() => setShowtimeModalVisible(false)}
                footer={null}
                width={800}
            >
                <Table
                    columns={showtimeColumns}
                    dataSource={Array.isArray(showtimes) ? showtimes : []}
                    rowKey="id"
                    pagination={false}
                    locale={{
                        emptyText: 'Không có suất chiếu nào.',
                    }}
                />
            </Modal>
        </div>
    );
};

export default MoviesDashboard;
