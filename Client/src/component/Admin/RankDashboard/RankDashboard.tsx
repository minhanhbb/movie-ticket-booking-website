import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notification, Table, Pagination, Input, Button, Popconfirm } from 'antd'; // Import Ant Design components
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'; // Ant Design icons
import { Rank } from '../../../interface/Rank';
import instance from '../../../server';


const RankDashboard = () => {
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const ranksPerPage = 7;
    const { Search } = Input;
    // Lấy dữ liệu từ API
    useEffect(() => {
        const fetchRanks = async () => {
            setLoading(true);
            try {
                const response = await instance.get('/admin/ranks');
                setRanks(response.data.data);
            } catch (error) {
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải danh sách hạng.',
                    placement: 'topRight',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchRanks();
    }, []);

    // Lọc và phân trang
    const filteredRanks = ranks.filter((rank) =>
        rank.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRanks = filteredRanks.length;
    const currentRanks = filteredRanks.slice(
        (currentPage - 1) * ranksPerPage,
        currentPage * ranksPerPage
    );

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handleDelete = async (id: number) => {
        setLoading(true);
        try {
            await instance.delete(`/ranks/${id}`);
            setRanks((prevRanks) => prevRanks.filter((rank) => rank.id !== id));
            notification.success({
                message: 'Thành công',
                description: 'Hạng đã được xóa thành công.',
                placement: 'topRight',
            });
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể xóa hạng. Vui lòng thử lại sau.',
                placement: 'topRight',
            });
        } finally {
            setLoading(false);
        }
    };
    

    // Cấu hình cột bảng
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            className: 'text-center',
        },
        {
            title: 'Tên Hạng',
            dataIndex: 'name',
            key: 'name',
            className: 'text-center',
        },
        {
            title: 'Tổng Số Đơn Hàng',
            dataIndex: 'total_order_amount',
            key: 'total_order_amount',
            className: 'text-center',
        },
        {
            title: 'Phần Trăm Giảm Giá',
            dataIndex: 'percent_discount',
            key: 'percent_discount',
            className: 'text-center',
            render: (percent: number) => `${percent}%`,
        },
        {
            title: 'Hành Động',
            key: 'action',
            className: 'text-center',
            render: (text: any, rank: Rank) => (
                <div className="d-flex justify-content-around">
                    <Link to={`/admin/rank/edit/${rank.id}`}>
                        <Button type="primary" icon={<EditOutlined />} />
                    </Link>
                    {/* <Popconfirm
                        title="Bạn có chắc chắn muốn xóa hạng này?"
                        onConfirm={() => handleDelete(rank.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm> */}
                </div>
            ),
        },
    ];

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/rank/add'}>
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                        Thêm Hạng
                    </Button>
                </Link>
                <Search
                    placeholder="Tìm kiếm theo tên hạng"
                    onSearch={(value) => setSearchTerm(value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={currentRanks}
                rowKey="id"
                pagination={false} // Disable built-in pagination
                loading={loading}
                locale={{
                    emptyText: 'Không có hạng nào.',
                }}
            />
            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    current={currentPage}
                    total={totalRanks}
                    pageSize={ranksPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total) => `Tổng số ${total} hạng`}
                />
            </div>
        </div>
    );
};

export default RankDashboard;