import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'; // Ant Design icons
import { notification, Table, Pagination, Input, Button, Popconfirm } from 'antd'; // Import Ant Design components
import instance from '../../../server';
import { SeatLayout } from '../../../interface/SeatLayout'; // Import SeatLayout interface

const SeatLayoutDashboard = () => {
    const [seatLayouts, setSeatLayouts] = useState<SeatLayout[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const seatLayoutsPerPage = 7;
    const { Search } = Input;

    useEffect(() => {
        const fetchSeatLayouts = async () => {
            try {
                const response = await instance.get('/matrix'); // API call for seat layouts
                setSeatLayouts(response.data.data);
            } catch (error) {
                console.error('Error fetching seat layouts:', error);
                notification.error({
                    message: 'Error',
                    description: 'Unable to load seat layouts!',
                    placement: 'topRight',
                });
            }
        };
        fetchSeatLayouts();
    }, []);

    const handleDelete = async (id: number) => {
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa layout ghế này?');
        if (!isConfirmed) return;

        try {
            await instance.delete(`/matrix/${id}`);
            setSeatLayouts((prevLayouts) => prevLayouts.filter((layout) => layout.id !== id));
            notification.success({
                message: 'Thành công',
                description: 'Layout ghế đã được xóa!',
                placement: 'topRight',
            });
        } catch (error) {
            console.error('Error deleting seat layout:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể xóa layout ghế!',
                placement: 'topRight',
            });
        }
    };

    const filteredSeatLayouts = seatLayouts.filter(layout =>
        layout.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalSeatLayouts = filteredSeatLayouts.length;
    const currentSeatLayouts = filteredSeatLayouts.slice(
        (currentPage - 1) * seatLayoutsPerPage,
        currentPage * seatLayoutsPerPage
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
            title: 'Tên Layout',
            dataIndex: 'name',
            key: 'name',
            className: 'text-center',
        },
        {
            title: 'Số Hàng',
            dataIndex: 'rows',
            key: 'rows',
            className: 'text-center',
        },
        {
            title: 'Số Cột',
            dataIndex: 'columns',
            key: 'columns',
            className: 'text-center',
        },
        {
            title: 'Số Ghế Thường',
            dataIndex: 'row_regular_seat',
            key: 'row_regular_seat',
            className: 'text-center',
        },
        {
            title: 'Số Ghế VIP',
            dataIndex: 'row_vip_seat',
            key: 'row_vip_seat',
            className: 'text-center',
        },
        {
            title: 'Số Ghế Cặp',
            dataIndex: 'row_couple_seat',
            key: 'row_couple_seat',
            className: 'text-center',
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            className: 'text-center',
        },
        {
            title: 'Hành Động',
            key: 'action',
            className: 'text-center',
            render: (text: any, seatLayout: SeatLayout) => (
                <div className="d-flex justify-content-around">
                    <Link to={`/admin/matrix/edit/${seatLayout.id}`}>
                        <Button type="primary" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa layout ghế này?"
                        onConfirm={() => handleDelete(seatLayout.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/matrix/add'}>
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                        Thêm Layout Ghế
                    </Button>
                </Link>
                <Search
                    placeholder="Tìm kiếm theo tên layout"
                    onSearch={(value) => setSearchTerm(value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={currentSeatLayouts}
                rowKey="id"
                pagination={false} // Disable built-in pagination
                locale={{
                    emptyText: 'Không có layout ghế nào.',
                }}
            />
            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    current={currentPage}
                    total={totalSeatLayouts}
                    pageSize={seatLayoutsPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total) => `Tổng số ${total} layout ghế`}
                />
            </div>
        </div>
    );
};

export default SeatLayoutDashboard;