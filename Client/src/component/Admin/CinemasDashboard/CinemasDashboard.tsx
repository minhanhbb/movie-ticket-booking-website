import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Input, Space, notification, Pagination, Popconfirm } from 'antd';
import instance from '../../../server';
import { useCinemaContext } from '../../../Context/CinemasContext';
import { Movie } from '../../../interface/Movie';
import { MovieInCinema } from '../../../interface/MovieInCinema';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'; // Ant Design icons
const { Search } = Input;

const CinemasDashboard: React.FC = () => {
    const { state, dispatch } = useCinemaContext();
    const { cinemas } = state;

    const [currentPage, setCurrentPage] = useState(1);
    const [expandedCinemaId, setExpandedCinemaId] = useState<number | null>(null);
    const [selectedCinemaMovies, setSelectedCinemaMovies] = useState<MovieInCinema[]>([]);
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const cinemasPerPage = 5;
    const [userRole, setUserRole] = useState<string>("");
  useEffect(() => {
    // Lấy thông tin từ localStorage
    const userData = JSON.parse(localStorage.getItem("user_profile") || "{}");
    const roles = userData.roles || [];
   
    // Lấy vai trò đầu tiên (nếu có)
    if (roles.length > 0) {
      setUserRole(roles[0].name); // Gán vai trò (ví dụ: "staff", "admin")
    }
  }, []);

 

    const filteredCinemas = cinemas.filter((cinema) =>
        cinema.cinema_name &&
        cinema.cinema_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalCinemas = filteredCinemas.length;

    const currentCinemas = filteredCinemas.slice(
        (currentPage - 1) * cinemasPerPage,
        currentPage * cinemasPerPage
    );
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setExpandedCinemaId(null);
        setSelectedCinemaMovies([]);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên Rạp',
            dataIndex: 'cinema_name',
            key: 'cinema_name',
          
        },
        {
            title: 'Điện Thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Vị Trí',
            dataIndex: ['city'],
            key: 'location_name',
        },
        {
            title: 'Địa Chỉ',
            dataIndex: 'cinema_address',
            key: 'cinema_address',
        },
        {
            title: 'Hành Động',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <Link to={`/admin/cinemas/edit/${record.id}`}>
                    <Button type="primary" icon={<EditOutlined />} />
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <div className="container mt-5">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                {userRole === 'admin' && (
                    <Link to="/admin/cinemas/add">
                        <Button type="primary" icon={<PlusOutlined />} size="large">
                            Thêm Rạp
                        </Button>
                    </Link>
                )}
                <Search
                    placeholder="Tìm kiếm theo tên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '300px' }}
                    allowClear
                />
            </div>
            <Table
                dataSource={currentCinemas} columns={columns}
                pagination={false}
                rowKey="id"
                expandable={{
                    expandedRowRender: (record) =>
                        expandedCinemaId === record.id && selectedCinemaMovies.length > 0 ? (
                            <div>
                                <h4>Phim trong rạp {record.cinema_name}</h4>
                                <ul>
                                    {selectedCinemaMovies.map((movie) => (
                                        <li key={movie.movie_id}>{movie.movie.movie_name}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : null,
                    rowExpandable: () => true,
                }}
            />
            <div className="d-flex justify-content-center mt-4">
            <Pagination
                current={currentPage}
                total={totalCinemas}
                pageSize={cinemasPerPage}
                onChange={handlePageChange}
                className="mt-4 text-center"
            />
            </div>
        </div>
    );
};

export default CinemasDashboard;