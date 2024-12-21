import React, { useEffect, useState } from "react";
import { Table, Card, Space, notification, Row, Col, DatePicker, Select } from "antd";
import { Link } from "react-router-dom";
import instance from "../../../server";
import { Booking } from "../../../interface/Booking";
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, PrinterOutlined } from '@ant-design/icons';
import './OrdersDashboard.css'
import Search from "antd/es/input/Search";
import moment from "moment";  // Để làm việc với thời gian

const OrdersDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]); 
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]); 
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [userRole, setUserRole] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<any>(null);  // Lọc theo ngày
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>("");  // Lọc theo trạng thái

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_profile") || "{}");
    const roles = userData.roles || [];
   
    if (roles.length > 0) {
      setUserRole(roles[0].name);
    } else {
      setUserRole("unknown");
    }
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        let response;
        const params = {
          page: pagination.current,
          pageSize: pagination.pageSize,
        };
        
        if (userRole === "manager") {
          response = await instance.get(`/manager/order`, { params });
        } else if (userRole === "staff") {
          response = await instance.get(`/staff/order`, { params });
        } else {
          response = await instance.get(`/order`, { params });
        }

        setBookings(response.data.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total,
        }));
      } catch (error) {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin đơn hàng.",
        });
      }
    };

    if (userRole !== "") {
      fetchBookings();
    }
  }, [pagination.current, pagination.pageSize, userRole]);

  useEffect(() => {
    let filtered = bookings;

    // Lọc theo trạng thái
    if (selectedStatus) {
      filtered = filtered.filter((booking) => booking.status === selectedStatus);
    }


    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter((booking) => {
        const bookingCode = booking.booking_code?.toLowerCase() || "";
        const movieName = booking.showtime?.movie?.movie_name?.toLowerCase() || "";
        const userName = booking.user?.user_name?.toLowerCase() || "";
        const payName = booking.pay_method?.pay_method_name?.toLowerCase() || "";
        const term = searchTerm.toLowerCase();
        return (
          bookingCode.includes(term) ||
          movieName.includes(term) ||
          userName.includes(term) ||
          payName.includes(term)
        );
      });
    }

    setFilteredBookings(filtered);
  }, [searchTerm, bookings, selectedDate, selectedStatus]);  // Thêm các điều kiện lọc vào useEffect

  const getStatusStyle = (status: any) => {
    switch (status) {
      case 'Thanh toán thành công':
        return {
          className: 'status-Thanh toán thành công',
          icon: <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} />,
        };
      case 'Đang xử lý':
        return {
          className: 'status-Đang xử lý',
          icon: <ExclamationCircleOutlined style={{ color: 'orange', marginRight: 8 }} />,
        };
      case 'Thanh toán thất bại':
        return {
          className: 'status-Thanh toán thất bại',
          icon: <CloseCircleOutlined style={{ color: 'red', marginRight: 8 }} />,
        };
      case 'Đã hủy':
        return {
          className: 'status-Đã hủy',
          icon: <CloseCircleOutlined style={{ color: 'gray', marginRight: 8 }} />,
        };
      case 'Đã in vé':
        return {
          className: 'status-Đã in vé',
          icon: <PrinterOutlined style={{ color: 'blue', marginRight: 8 }} />,
        };
      default:
        return {
          className: 'status-default',
          icon: null,
        };
    }
  };

  const columns = [
    {
      title: "Mã Đơn Hàng",
      dataIndex: "booking_code",
      key: "id",
      align: "center" as const,
    },
    {
      title: "Người Dùng",
      dataIndex: ["user", "user_name"],
      key: "user_name",
      align: "center" as const,
      render: (text: string) => text || "Unknown User",
    },
    {
      title: "Suất Chiếu",
      dataIndex: ["showtime", "showtime_date"],
      key: "showtime_date",
      align: "center" as const,
      render: (text: string) => {
        // Chuyển đổi text thành đối tượng moment và định dạng thành "DD/MM/YYYY"
        return text ? moment(text).format("DD/MM/YYYY") : "-";
      },
    },
    
    {
      title: "Phim",
      dataIndex: ["showtime","movie", "movie_name"],
      key: "movie_name",
      align: "center" as const,
    },
    {
      title: "Phương Thức Thanh Toán",
      dataIndex: ["pay_method", "pay_method_name"],
      key: "pay_method_name",
      align: "center" as const,
    },
    {
      title: "Tổng Tiền",
      dataIndex: "amount",
      key: "amount",
      align: "center" as const,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (text: string) => {
        const { className, icon } = getStatusStyle(text);
        return (
          <span className={className}>
            {icon}
            {text}
          </span>
        );
      },
    },
    {
      title: "Hành Động",
      key: "actions",
      align: "center" as const,
      render: (_: any, record: Booking) => (
        <Space>
          <Link to={`/admin/ordersdetail/${record.id}`} className="btn btn-primary">
            Chi tiết
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ margin: "20px" }}>
      <Row justify="space-between" align="middle">
        <Col>
          <h5>Đơn Hàng Gần Đây</h5>
        </Col>
        <Col>
          <Space>
           
            <Select 
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value)}
              style={{ width: 200 }}
              placeholder="Chọn trạng thái"
            >
              <Select.Option value="">Tất cả</Select.Option>
              <Select.Option value="Thanh toán thành công">Thanh toán thành công</Select.Option>
              <Select.Option value="Đang xử lý">Đang xử lý</Select.Option>
              <Select.Option value="Thanh toán thất bại">Thanh toán thất bại</Select.Option>
              <Select.Option value="Đã hủy">Đã hủy</Select.Option>
              <Select.Option value="Đã in vé">Đã in vé</Select.Option>
            </Select>
            <Search
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên phim"
              onSearch={(value) => setSearchTerm(value)}
              style={{ width: 300 }}
              allowClear
            />
          </Space>
        </Col>
      </Row>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Table
          columns={columns}
          dataSource={filteredBookings} 
          rowKey={(record) => record.id}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => {
              setPagination({
                current: page,
                pageSize: pageSize || pagination.pageSize,
                total: pagination.total,
              });
            },
            style: { display: "flex", justifyContent: "center" },
          }}
          bordered
        />
      </Space>
    </Card>
  );
};

export default OrdersDashboard;
