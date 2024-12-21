import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditOutlined, PlusOutlined } from '@ant-design/icons'; // Ant Design icons
import { notification, Table, Pagination, Input, Button } from 'antd'; // Import Ant Design components
import './ActorDashboard.css';
import { Actor } from '../../../interface/Actor';
import instance from '../../../server';

const ActorDashboard = () => {
    const [actors, setActors] = useState<Actor[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');  
    const actorsPerPage = 7;
    const { Search } = Input;

    useEffect(() => {
        // Fetch the actors from the API
        const fetchActors = async () => {
            try {
                const response = await instance.get('/manager/actor');
                setActors(response.data.data);
            } catch (error) {
                console.error('Error fetching actor data:', error);
                notification.error({
                    message: 'Error',
                    description: 'Could not load actor list!',
                    placement: 'topRight',
                });
            }
        };
        fetchActors();
    }, []);

    const filteredActors = actors.filter(actor =>
        actor.actor_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalActors = filteredActors.length;
    const totalPages = Math.ceil(totalActors / actorsPerPage);
    const currentActors = filteredActors.slice(
        (currentPage - 1) * actorsPerPage,
        currentPage * actorsPerPage
    );

    const handlePageChange = (page: number) => setCurrentPage(page);

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
            className: 'text-center',
            render: (photo: string) => (
                <img
                    src={photo ?? undefined}
                    alt="actor"
                    style={{ width: '80px', height: '120px', objectFit: 'cover' }}
                />
            ),
        },
        {
            title: 'Tên Diễn Viên',
            dataIndex: 'actor_name',
            key: 'actor_name',
            className: 'text-center',
        },
        {
            title: 'Quốc Gia',
            dataIndex: 'country',
            key: 'country',
            className: 'text-center',
        },
        {
            title: 'Hành Động',
            key: 'action',
            className: 'text-center',
            render: (text: any, actor: Actor) => (
                <Link to={`/admin/actor/edit/${actor.id}`} >
                    <Button type="primary" icon={<EditOutlined />} />
                </Link>
            ),
        },
    ];

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/actor/add'}>
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                        Thêm Diễn Viên
                    </Button>
                </Link>
                <Search
                    placeholder="Tìm kiếm theo tên diễn viên"
                    onSearch={(value) => setSearchTerm(value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={currentActors}
                rowKey="id"
                pagination={false} // Disable pagination in Table, we'll handle it ourselves
                locale={{
                    emptyText: 'Không có diễn viên nào.',
                }}
            />
            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    current={currentPage}
                    total={totalActors}
                    pageSize={actorsPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false} // Hide size changer as we're using a fixed size
                    showQuickJumper
                    showTotal={(total) => `Tổng số ${total} diễn viên`}
                />
            </div>
        </div>
    );
};

export default ActorDashboard;
