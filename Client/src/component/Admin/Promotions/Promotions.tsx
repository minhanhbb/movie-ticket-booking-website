import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { notification, Table, Pagination, Input, Button, Popconfirm } from 'antd';
import 'antd/dist/reset.css';
import instance from '../../../server';
import { Promotions } from '../../../interface/Promotions';

const PromotionsDashboard = () => {
    const [promotions, setPromotions] = useState<Promotions[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const promotionsPerPage = 7;
    const { Search } = Input;

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await instance.get('/manager/promotions');
                setPromotions(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu khuyến mãi:', error);
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải danh sách khuyến mãi!',
                    placement: 'topRight',
                });
            }
        };
        fetchPromotions();
    }, []);

    const filteredPromotions = promotions.filter((promotion) =>
        promotion.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPromotions = filteredPromotions.length;
    const currentPromotions = filteredPromotions.slice(
        (currentPage - 1) * promotionsPerPage,
        currentPage * promotionsPerPage
    );

    const handlePageChange = (page: number) => setCurrentPage(page);

    const deletePromotion = async (id: number) => {
        try {
            await instance.delete(`/manager/promotions/${id}`);
            setPromotions(promotions.filter((promotion) => promotion.id !== id));
            notification.success({
                message: 'Thành Công',
                description: 'Khuyến mãi đã được xóa thành công!',
                placement: 'topRight',
            });
        } catch (error) {
            console.error('Lỗi khi xóa khuyến mãi:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể xóa khuyến mãi!',
                placement: 'topRight',
            });
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            align: 'center' as const,
        },
        {
            title: 'Mã Khuyến Mãi',
            dataIndex: 'code',
            key: 'code',
            align: 'center' as const,
        },
        {
            title: 'Giảm Giá (%)',
            dataIndex: 'discount_percentage',
            key: 'discount_percentage',
            align: 'center' as const,
        },
        {
            title: 'Giảm Tối Đa',
            dataIndex: 'max_discount',
            key: 'max_discount',
            align: 'center' as const,
        },
        {
            title: 'Hóa Đơn Tối Thiểu',
            dataIndex: 'min_purchase',
            key: 'min_purchase',
            align: 'center' as const,
        },
        {
            title: 'Thời Gian Áp Dụng',
            dataIndex: 'valid_from',
            key: 'valid_from',
            align: 'center' as const,
        },
        {
            title: 'Thời Gian Hết Hạn',
            dataIndex: 'valid_to',
            key: 'valid_to',
            align: 'center' as const,
        },
        {
            title: 'Hành Động',
            key: 'action',
            align: 'center' as const,
            render: (text: any, promotion: Promotions) => (
                <div className="d-flex justify-content-around">
                    <Link to={`/admin/promotions/edit/${promotion.id}`}>
                        <Button type="primary" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa khuyến mãi này?"
                        onConfirm={() => deletePromotion(promotion.id)}
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
                <Link to={'/admin/promotions/add'}>
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                        Thêm Khuyến Mãi
                    </Button>
                </Link>
                <Search
                    placeholder="Tìm kiếm theo mã"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={currentPromotions}
                rowKey="id"
                pagination={false}
                locale={{
                    emptyText: 'Không có khuyến mãi nào.',
                }}
            />
            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    current={currentPage}
                    total={totalPromotions}
                    pageSize={promotionsPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total) => `Tổng số ${total} khuyến mãi`}
                />
            </div>
        </div>
    );
};

export default PromotionsDashboard;
