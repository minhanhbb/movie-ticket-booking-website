import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'; // Ant Design icons
import { notification, Table, Pagination, Input, Button, Popconfirm } from 'antd'; // Import Ant Design components
import instance from '../../../server';
import { PayMethod } from '../../../interface/PayMethod';

const PayMethodDashboard = () => {
    const [payMethods, setPayMethods] = useState<PayMethod[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const payMethodsPerPage = 7;
    const { Search } = Input;

    useEffect(() => {
        const fetchPayMethods = async () => {
            try {
                const response = await instance.get('/admin/method');
                setPayMethods(response.data.data);
            } catch (error) {
                console.error('Error fetching payment methods:', error);
                notification.error({
                    message: 'Error',
                    description: 'Unable to load payment methods!',
                    placement: 'topRight',
                });
            }
        };
        fetchPayMethods();
    }, []);

    const handleDelete = async (id: string) => {
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa phương thức thanh toán này?');
        if (!isConfirmed) return;

        try {
            await instance.delete(`/admin/method/${id}`);
            setPayMethods((prevMethods) => prevMethods.filter((method) => method.id !== id));
            notification.success({
                message: 'Thành công',
                description: 'Phương thức thanh toán đã được xóa!',
                placement: 'topRight',
            });
        } catch (error) {
            console.error('Error deleting payment method:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể xóa phương thức thanh toán!',
                placement: 'topRight',
            });
        }
    };

    const filteredPayMethods = payMethods.filter(payMethod =>
        payMethod.pay_method_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPayMethods = filteredPayMethods.length;
    const currentPayMethods = filteredPayMethods.slice(
        (currentPage - 1) * payMethodsPerPage,
        currentPage * payMethodsPerPage
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
            title: 'Tên Phương Thức Thanh Toán',
            dataIndex: 'pay_method_name',
            key: 'pay_method_name',
            className: 'text-center',
        },
        {
            title: 'Hành Động',
            key: 'action',
            className: 'text-center',
            render: (text: any, payMethod: PayMethod) => (
                <div className="d-flex justify-content-around">
                    <Link to={`/admin/method/edit/${payMethod.id}`}>
                        <Button type="primary" icon={<EditOutlined />} />
                    </Link>
                    {/* <Popconfirm
                        title="Bạn có chắc chắn muốn xóa phương thức thanh toán này?"
                        onConfirm={() => handleDelete(payMethod.id)}
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
                <Link to={'/admin/method/add'}>
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                        Thêm Phương Thức Thanh Toán
                    </Button>
                </Link>
                <Search
                    placeholder="Tìm kiếm theo tên phương thức"
                    onSearch={(value) => setSearchTerm(value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={currentPayMethods}
                rowKey="id"
                pagination={false} // Disable built-in pagination
                locale={{
                    emptyText: 'Không có phương thức thanh toán nào.',
                }}
            />
            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    current={currentPage}
                    total={totalPayMethods}
                    pageSize={payMethodsPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total) => `Tổng số ${total} phương thức`}
                />
            </div>
        </div>
    );
};

export default PayMethodDashboard;
