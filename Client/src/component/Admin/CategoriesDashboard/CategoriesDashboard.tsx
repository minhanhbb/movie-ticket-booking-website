import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'; // Ant Design icons
import { notification, Table, Pagination, Input, Button, Popconfirm } from 'antd'; // Import Ant Design components

import { useCategoryContext } from '../../../Context/CategoriesContext';

const CategoriesDashboard = () => {
    const { state, deleteCategory } = useCategoryContext();
    const { categories } = state;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const categoriesPerPage = 7;

    const filteredCategories = categories.filter((category) =>
        category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCategories = filteredCategories.length;
    const currentCategories = filteredCategories.slice(
        (currentPage - 1) * categoriesPerPage,
        currentPage * categoriesPerPage
    );

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handleDelete = (id: number) => {
        deleteCategory(id);
        notification.success({
            message: 'Thành Công',
            description: 'Thể loại đã được xóa thành công!',
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
            title: 'Tên Thể Loại',
            dataIndex: 'category_name',
            key: 'category_name',
            className: 'text-center',
        },
        {
            title: 'Hành Động',
            key: 'action',
            className: 'text-center',
            render: (text: any, category: any) => (
                <div className="d-flex justify-content-around">
                    <Link to={`/admin/categories/edit/${category.id}`}>
                        <Button type="primary" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa thể loại này?"
                        onConfirm={() => handleDelete(category.id)}
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
                <Link to={'/admin/categories/add'}>
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                        Thêm Thể Loại Phim
                    </Button>
                </Link>
                <Input
                    placeholder="Tìm kiếm theo tên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={currentCategories}
                rowKey="id"
                pagination={false} // Disable built-in pagination
                locale={{
                    emptyText: 'Không có thể loại nào.',
                }}
            />
            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    current={currentPage}
                    total={totalCategories}
                    pageSize={categoriesPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total) => `Tổng số ${total} thể loại`}
                />
            </div>
        </div>
    );
};

export default CategoriesDashboard;
