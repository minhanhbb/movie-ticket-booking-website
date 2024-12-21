// import React, { useEffect, useState } from "react";
// import { Table, Button, Select, Input, DatePicker, Pagination, Card, Space, notification } from "antd";
// import { Link } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPrint } from "@fortawesome/free-solid-svg-icons";
// import instance from "../../../server";
// import { Booking } from "../../../interface/Booking";
// import { CheckCircleOutlined, ClockCircleOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// import dayjs from "dayjs";
// import './OrdersDashboard.css'

// const { Option } = Select;
// const { RangePicker } = DatePicker;

// const OrdersAll: React.FC = () => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(0);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [statusFilter, setStatusFilter] = useState<string>("");
//   const [dateRange, setDateRange] = useState<[string, string] | null>(null);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const response = await instance.get(`/order?page=${currentPage}`);
//         setBookings(response.data.data.data);
//         setTotalPages(response.data.data.last_page);
//       } catch (error) {
//         notification.error({
//           message: "Lỗi",
//           description: "Không thể tải thông tin đơn hàng.",
//         });
//       }
//     };

//     fetchBookings();
//   }, [currentPage]);

//   const getStatusStyle = (status: string) => {
//     switch (status) {
//       case 'Pain':
//         return {
//           className: 'status-pain',
//           icon: <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} />,
//         };
//       case 'Confirmed':
//         return {
//           className: 'status-confirmed',
//           icon: <ExclamationCircleOutlined style={{ color: 'orange', marginRight: 8 }} />,
//         };
//       case 'Pending':
//         return {
//           className: 'status-pending',
//           icon: <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} />,
//         };
//       default:
//         return {
//           className: 'status-default',
//           icon: null,
//         };
//     }
//   };

//   const handlePrintInvoice = (booking: Booking) => {
//     const invoiceWindow = window.open("", "_blank");
//     if (!invoiceWindow) {
//       notification.error({
//         message: "Lỗi",
//         description: "Không thể mở cửa sổ in hóa đơn.",
//       });
//       return;
//     }
//     const invoiceContent = `
//       <html>
//       <head>
//         <title>Hóa đơn</title>
//         <style>
//           body { font-family: Arial, sans-serif; margin: 20px; }
//           h1 { text-align: center; color: #333; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
//           th { background-color: #f4f4f4; }
//         </style>
//       </head>
//       <body>
//         <h1>Hóa đơn</h1>
//         <p><strong>Mã Đơn Hàng:</strong> ${booking.id}</p>
//         <p><strong>Người Dùng:</strong> ${booking.user?.user_name || "Không xác định"}</p>
//         <p><strong>Email:</strong> ${booking.user?.email || "Không xác định"}</p>
//         <p><strong>Suất Chiếu:</strong> ${booking.showtime?.showtime_date || "Không xác định"}</p>
//         <p><strong>Phim:</strong> ${booking.showtime.movie.movie_name || "Không xác định"}</p>
//         <p><strong>Tổng Tiền:</strong> ${booking.amount}</p>
//         <hr />
//         <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
//       </body>
//       </html>
//     `;
//     invoiceWindow.document.write(invoiceContent);
//     invoiceWindow.document.close();
//     invoiceWindow.print();
//   };

//   const columns = [
//     {
//       title: "ID",
//       dataIndex: "id",
//       key: "id",
//       align: "center" as const,
//     },
//     {
//       title: "Người Dùng",
//       dataIndex: ["user", "user_name"],
//       key: "user_name",
//       align: "center" as const,
//       render: (text: string) => text || "Unknown User",
//     },
//     {
//       title: "Suất Chiếu",
//       dataIndex: ["showtime", "showtime_date"],
//       key: "showtime_date",
//       align: "center" as const,
//     },
//     {
//       title: "Phim",
//       dataIndex: ["showtime", "movie_in_cinema", "movie", "movie_name"],
//       key: "movie_name",
//       align: "center" as const,
//     },
//     {
//       title: "Phương Thức Thanh Toán",
//       dataIndex: ["pay_method", "pay_method_name"],
//       key: "pay_method_name",
//       align: "center" as const,
//     },
//     {
//       title: "Tổng Tiền",
//       dataIndex: "amount",
//       key: "amount",
//       align: "center" as const,
//     },
//     {
//       title: "Trạng Thái",
//       dataIndex: "status",
//       key: "status",
//       render: (text: string) => {
//         const { className, icon } = getStatusStyle(text);
//         return (
//           <span className={className}>
//             {icon}
//             {text}
//           </span>
//         );
//       },
//     },
//     {
//       title: "Hành Động",
//       key: "actions",
//       align: "center" as const,
//       render: (_: any, record: Booking) => (
//         <Space>
//           <Link to={`/admin/orders/edit/${record.id}`}>
//             <Button type="primary" icon={<EditOutlined />} />
//           </Link>
//           <Button
//             type="default"
//             icon={<FontAwesomeIcon icon={faPrint} />}
//             onClick={() => handlePrintInvoice(record)}
//           >
//             In
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <Card title="Doanh Thu" style={{ margin: "20px" }}>
//       <Space direction="vertical" style={{ width: "100%" }}>
//         <Space style={{ display: "flex", justifyContent: "space-between" }}>
//           <Select
//             value={statusFilter}
//             onChange={(value) => setStatusFilter(value)}
//             style={{ width: 200 }}
//             placeholder="Trạng thái"
//           >
//             <Option value="">Tất cả trạng thái</Option>
//             <Option value="Pending">Pending</Option>
//             <Option value="Confirmed">Confirmed</Option>
//             <Option value="Paid">Paid</Option>
//           </Select>
//           <RangePicker
//             onChange={(dates) => {
//               if (dates) {
//                 setDateRange([dayjs(dates[0]).format("YYYY-MM-DD"), dayjs(dates[1]).format("YYYY-MM-DD")]);
//               } else {
//                 setDateRange(null);
//               }
//             }}
//           />
//           <Input
//             placeholder="Tìm kiếm..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{ width: 300 }}
//           />
//         </Space>
//         <Table
//           columns={columns}
//           dataSource={bookings}
//           rowKey={(record) => record.id}
//           pagination={false}
//           bordered
//         />
//         <div className="d-flex justify-content-center mt-4">
//           <Pagination
//             current={currentPage}
//             total={totalPages * 10}
//             onChange={(page) => setCurrentPage(page)}
//             style={{ textAlign: "center" }}
//           />
//         </div>
//       </Space>
//     </Card>
//   );
// };

// export default OrdersAll;
