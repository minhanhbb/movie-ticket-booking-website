import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'; // Ant Design icons
import { notification, Table, Pagination, Input, Button, Popconfirm, Switch } from 'antd'; // Import Ant Design components
import instance from '../../../server';
import { SeatMapAdmin } from '../../../interface/SeatMap';


const SeatMap = () => {
    const [seatLayouts, setSeatLayouts] = useState<SeatMapAdmin[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const seatLayoutsPerPage = 7;
    const { Search } = Input;

    useEffect(() => {
        const fetchSeatLayouts = async () => {
            try {
                const response = await instance.get('/manager/seat-maps'); // API call for seat layouts
                setSeatLayouts(response.data);
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
            await instance.delete(`/manager/seat-maps/${id}`);
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
    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        try {
            await instance.post(`/manager/seatMapStatus/${id}`, { status: !currentStatus });
            setSeatLayouts((prevLayouts) =>
                prevLayouts.map((layout) =>
                    layout.id === id ? { ...layout, status: !currentStatus } : layout
                )
            );
            notification.success({
                message: 'Cập nhật trạng thái Layout ghế thành công!',
                description: `Layout ghế đã được ${!currentStatus ? 'hiện' : 'ẩn'}.`,
                placement: 'topRight',
              });
        } catch (error) {
            console.error('Error updating seat map status:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể cập nhật trạng thái!',
                placement: 'topRight',
            });
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            className: 'text-center',
        },
        {
            title: 'Tên Sơ Đồ',
            dataIndex: 'name',
            key: 'name',
            className: 'text-center',
        },
        {
            title: 'Mô Tả',
            dataIndex: 'description',
            key: 'description',
            className: 'text-center',
        },
        {
            title: 'Hàng',
            dataIndex: 'matrix_row',
            key: 'matrix_row',
            className: 'text-center',
        },
        {
            title: 'Cột',
            dataIndex: 'matrix_column',
            key: 'matrix_column',
            className: 'text-center',
        },
        {
            title: 'Hàng Ghế Thường',
            dataIndex: 'row_regular_seat',
            key: 'row_regular_seat',
            className: 'text-center',
        },
        {
            title: 'Hàng Ghế VIP',
            dataIndex: 'row_vip_seat',
            key: 'row_vip_seat',
            className: 'text-center',
        },
        {
            title: 'Hàng Ghế Cặp',
            dataIndex: 'row_couple_seat',
            key: 'row_couple_seat',
            className: 'text-center',
        },
         {
            title: 'Trạng Thái',
            key: 'status',
            className: 'text-center',
            render: (combo: any, seatLayout: SeatMapAdmin) => (
                <div style={{ textAlign: 'center' }}>
                    <Switch
                        checked={seatLayout.status}
                        onChange={() => handleToggleStatus(seatLayout.id, seatLayout.status)}
                        checkedChildren="On"
                        unCheckedChildren="Off"
                    />
                </div>
            ),
        },
        {
            title: 'Hành Động',
            key: 'action',
            className: 'text-center',
            render: (text: any, seatLayout: SeatMapAdmin) => (
                <div className="d-flex justify-content-around">
             
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
                <Link to={'/admin/seat-maps/add'}>
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                        Thêm Sơ Đồ Ghế
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

export default SeatMap;
