import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'; // Ant Design icons
import { notification, Table, Pagination, Input, Button, Popconfirm } from 'antd'; // Import Ant Design components
import instance from '../../../server';
import { Director } from '../../../interface/Director';

const DirectorDashboard = () => {
    const [directors, setDirectors] = useState<Director[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const directorsPerPage = 7;
    const { Search } = Input;

    useEffect(() => {
        const fetchDirectors = async () => {
            try {
                const response = await instance.get('/manager/director');
                setDirectors(response.data.data);
            } catch (error) {
                setError('Không thể tải danh sách đạo diễn');
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải danh sách đạo diễn!',
                });
            }
        };

        fetchDirectors();
    }, []);

    const filteredDirectors = directors.filter((director) =>
        director.director_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalDirectors = filteredDirectors.length;
    const currentDirectors = filteredDirectors.slice(
        (currentPage - 1) * directorsPerPage,
        currentPage * directorsPerPage
    );

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handleDelete = (id: number) => {
        // Handle delete director logic here (API call)
        notification.success({
            message: 'Thành Công',
            description: 'Đạo diễn đã được xóa thành công!',
            placement: 'topRight',
        });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            className: 'text-center',
        },
        {
            title: 'Ảnh',
            dataIndex: 'photo',
            key: 'photo',
            render: (photo: string) => (
                <img src={photo ?? undefined} alt="Director" style={{ width: '80px', height: '120px', objectFit: 'cover' }}/>
            ),
            className: 'text-center',
        },
        {
            title: 'Tên Đạo Diễn',
            dataIndex: 'director_name',
            key: 'director_name',
            className: 'text-center',
        },
        {
            title: 'Quốc Gia',
            dataIndex: 'country',
            key: 'country',
            render: (country: string) => country || 'Chưa xác định',
            className: 'text-center',
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (text: any, director: any) => (
                <div className="d-flex justify-content-around">
                    <Link to={`/admin/director/edit/${director.id}`}>
                        <Button type="primary" icon={<EditOutlined />} />
                    </Link>
                    
                </div>
            ),
            className: 'text-center',
        },
    ];

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/director/add'}>
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                        Thêm Đạo Diễn
                    </Button>
                </Link>
                <Search
                    placeholder="Tìm kiếm theo tên đạo diễn"
                    onSearch={(value) => setSearchTerm(value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={currentDirectors}
                rowKey="id"
                pagination={false} // Disable built-in pagination
                locale={{
                    emptyText: 'Không có đạo diễn nào.',
                }}
            />
            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    current={currentPage}
                    total={totalDirectors}
                    pageSize={directorsPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total) => `Tổng số ${total} đạo diễn`}
                />
            </div>
        </div>
    );
};

export default DirectorDashboard;
