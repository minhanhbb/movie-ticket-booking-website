import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShowtimeContext } from '../../../Context/ShowtimesContext';
import instance from '../../../server';
import { Movie } from '../../../interface/Movie';
import { notification, Table, Button, Input, Pagination, Switch, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ShowtimesDashboard: React.FC = () => {
    const { state, dispatch } = useShowtimeContext();
    const { showtimes } = state; // Truyền lại showtimes từ context
    const [error, setError] = useState<string | null>(null);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

    const { Search } = Input;
    const { Option } = Select;

    // Fetch showtimes và movies từ API
    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const response = await instance.get(`/manager/showtimes?page=${currentPage}`);
                if (Array.isArray(response.data.data.data)) {
                    dispatch({ type: 'SET_SHOWTIMES', payload: response.data.data.data });
                } else {
                    setError('Không thể lấy showtime: Định dạng phản hồi không mong đợi');
                }
            } catch (err) {
                setError('Không thể lấy showtime');
            }
        };

        const fetchMovies = async () => {
            try {
                const movieResponse = await instance.get('/manager/movies');
                if (Array.isArray(movieResponse.data.data.original)) {
                    setMovies(movieResponse.data.data.original);
                } else {
                    setError('Không thể lấy danh sách phim: Định dạng phản hồi không mong đợi');
                }
            } catch (err) {
                setError('Không thể lấy danh sách phim');
            }
        };

        fetchShowtimes();
        fetchMovies();
    }, [dispatch, currentPage]);

    // Lọc showtimes theo tên phim, phòng, và khung giờ
    const filteredShowtimes = showtimes.filter((showtime) => {
        const movieNameMatch = showtime.movie?.movie_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const roomMatch = selectedRoom ? showtime.room?.room_name === selectedRoom : true;
        return movieNameMatch && roomMatch ;
    });

    // Xử lý xóa showtime
    const deleteShowtime = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa showtime này?')) {
            try {
                await instance.delete(`/manager/showtimes/${id}`);
                dispatch({ type: 'DELETE_SHOWTIME', payload: id });

                // Thông báo thành công
                notification.success({
                    message: 'Xóa Thành Công',
                    description: 'Showtime đã được xóa thành công!',
                });
            } catch (err) {
                // Thông báo lỗi
                notification.error({
                    message: 'Lỗi Xóa Showtime',
                    description: 'Không thể xóa showtime. Vui lòng thử lại sau.',
                });
            }
        }
    };

    // Định dạng giá tiền
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const handleStatusChange = async (id: number, currentStatus: boolean) => {
        try {
            const newStatus = !currentStatus; // Đảo ngược trạng thái hiện tại
            await instance.post(`/manager/showtimeStatus/${id}`, { status: newStatus }); // Gửi API
    
            // Cập nhật trạng thái trong context
            dispatch({
                type: 'UPDATE_SHOWTIME_STATUS',
                payload: { id, status: newStatus },
            });
    
            // Thông báo thành công
            notification.success({
                message: 'Cập Nhật Thành Công',
                description: `Trạng thái showtime đã được${newStatus ? 'Hiện' : 'Ẩn'}.`,
            });
        } catch (err) {
            notification.error({
                message: 'Lỗi Cập Nhật',
                description: 'Không thể cập nhật trạng thái showtime. Vui lòng thử lại.',
            });
        }
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    // Cột hiển thị của bảng Ant Design
    const columns = [
        {
            title: 'Phim',
            dataIndex: ['movie','movie_name'],
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
            render: (price: number) => formatCurrency(price),
        },
        {
            title: 'Trạng Thái',
            key: 'status',
            render: (_: any, record: any) => (
                <div style={{ textAlign: 'left' }}>
                    <Switch
                        checked={record.status} // Trạng thái hiện tại từ API
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        onChange={() => handleStatusChange(record.id, record.status)} // Xử lý thay đổi
                    />
                </div>
            ),
            className: 'text-left',
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_ :any, record: any) => (
                <div className="d-flex justify-content-around">
                    <Link to={`/admin/showtimes/edit/${record.id}`}>
                        <Button icon={<EditOutlined />} type="primary" />
                    </Link>
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => deleteShowtime(record.id)}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to="/admin/showtimes/add">
                    <Button type="primary" icon={<PlusOutlined />}>
                        Thêm Suất Chiếu
                    </Button>
                </Link>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Select
                        placeholder="Chọn Phòng"
                        value={selectedRoom}
                        onChange={setSelectedRoom}
                        style={{ width: 150 }}
                    >
                        <Option value="">Tất cả phòng</Option>
                        {showtimes.map(showtime => (
                            <Option key={showtime.room?.room_name} value={showtime.room?.room_name}>
                                {showtime.room?.room_name}
                            </Option>
                        ))}
                    </Select>
                    <Search
                    placeholder="Tìm kiếm theo tên phim"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={filteredShowtimes}
                rowKey="id"
                pagination={false}
            />
            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    current={currentPage}
                    onChange={(page) => setCurrentPage(page)}
                    total={50} // Điều chỉnh tổng số bản ghi phù hợp
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

export default ShowtimesDashboard;
