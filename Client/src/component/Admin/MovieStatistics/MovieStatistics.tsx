import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper } from "@mui/material";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import "./MovieStatistics.css"
import { useParams } from "react-router-dom";
import axios from "axios";
import instance from "../../../server";
import { DatePicker, Pagination } from "antd";
import * as XLSX from "xlsx";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);
interface MovieData {
  date: string;
  total_revenue: number;
}

interface MovieDashboard {
  booking_id: number;
  user_name: string;
  payMethod: string;
  amount: number;
  status: string;
  showtime_date: string;
  room_name: string;
  movie_name: string;
  created_at: string;
}
interface CinemaMovieChart {
  cinema_id: number;
  cinema_name: string;
  total_revenue: number;
}
const MovieStatistics = () => {
  const [movieData, setMovieData] = useState<MovieData[]>([]); // Định kiểu dữ liệu cho movieData
  const [dashboardData, setDashboardData] = useState<MovieDashboard[]>([]); 
  const [cinemaChartData, setCinemaChartData] = useState<CinemaMovieChart[]>([]);
  const [loading, setLoading] = useState(true);
  const { RangePicker } = DatePicker;
  const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [movieName, setMovieName] = useState<string>(""); // State for movie name
  const [userRole, setUserRole] = useState<string>("");

  // Fetch user role from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_profile") || "{}");
    const roles = userData.roles || [];
    
    if (roles.length > 0) {
      setUserRole(roles[0].name);
    } else {
      setUserRole("unknown"); // Gán giá trị mặc định khi không có vai trò
    }
  }, []);

  // Lấy movieId từ URL bằng useParams
  const { movieId } = useParams<{ movieId: string }>(); // movieId là tham số trong URL
  useEffect(() => {
    const fetchData = async () => {
      if (movieId) { // Kiểm tra nếu movieId có tồn tại
        
        try {
          const params: any = { movie_id: movieId };
          if (dateRange[0] && dateRange[1]) {
            params.start_date = dateRange[0];
            params.end_date = dateRange[1];
          }
          let response;
          if (userRole === "admin") {
            response = await instance.get("/admin/dashboard/Movie",{params});
          } else if (userRole === "manager") {
            response = await instance.get("/manager/dashboard/Movie",{params});
          } else {
            response = await instance.get("/dashboard/Movie",{params});
          }
          setMovieName(response.data.movie_name);
          setMovieData(response.data.day_chart_movie); // Dữ liệu từ API
          setDashboardData(response.data.movie_dashboarch); 
          setCinemaChartData(response.data.cinema_movie_chart); 
        } catch (error) {
          console.error("Error fetching data", error);
        } finally {
          setLoading(false);
        }
      }
    };
    if (userRole !== "") {
      fetchData();
    }
  }, [movieId,dateRange,userRole]); // Call API mỗi khi movieId thay đổi 
  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings); // Cập nhật state dateRange
  };
  const formatDate = (dateString:any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };
  
  const optionsTickets = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: "top" as const }, 
      title: {  display: true, 
        text: movieName ? `Phim ${movieName} ` : "Doanh Thu Của Phim Theo Ngày" },
    },
    scales: {
      x: {
        ticks: { maxRotation: 0, minRotation: 0 }, // Nhãn ngang cho biểu đồ thứ nhất
        grid: { display: false },
      },
      y: { grid: { display: true } },
    },
  };

  const optionsRevenue = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: "top" as const },
      title: { display: true, 
        text: movieName ? `Phim ${movieName} ` : "Doanh Thu Của Rạp Theo Phim"  },
    },
    scales: {
      x: {
        ticks: { maxRotation: 0, minRotation: 0 }, // Nhãn ngang cho biểu đồ thứ hai
        grid: { display: false },
      },
      y: { grid: { display: true } },
    },
  };

  const dataTickets = {
    labels: movieData.map(item => formatDate(item.date)),
    datasets: [
      {
        label: "Doanh Thu",
        data: movieData.map(item => item.total_revenue),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const dataRevenue = {
    labels: cinemaChartData.map((item) => item.cinema_name), // Tên các rạp
    datasets: [
      {
        label: "Rạp",
        data: cinemaChartData.map((item) => item.total_revenue), // Doanh thu tương ứng
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

// Hàm xử lý xuất Excel
const onExportExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(
    dashboardData.map((row) => ({
      "ID Đặt Vé": row.booking_id,
      "Tên Người Dùng": row.user_name,
      "Phương Thức Thanh Toán": row.payMethod,
      "Số Tiền (VNĐ)": row.amount,
      "Trạng Thái": row.status,
      "Ngày Chiếu": new Date(row.showtime_date).toLocaleDateString("vi-VN"),
      "Tên Phim": row.movie_name,
      "Phòng Chiếu": row.room_name,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Movie Statistics");
  XLSX.writeFile(workbook, `Movie_Statistics_${new Date().toISOString()}.xlsx`);
};


  return (
    <Box sx={{ padding: 4 }}>
      {/* Bộ lọc ngày và nút */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
        <div style={{ width: '300px' }}>
      <RangePicker  
        style={{ width: '100%' }} onChange={handleDateChange} 
      />
    </div>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>

          <Button variant="contained" color="success"onClick={onExportExcel}>Xuất báo cáo</Button>
        </Box>
      </Box>

      {/* Biểu đồ */}
      <Box sx={{ display: "flex", gap: 4, marginBottom: 4, height: 400 }}>
        <Box sx={{ flex: 1 }}>
          <Bar data={dataTickets} options={optionsTickets} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Bar data={dataRevenue} options={optionsRevenue} />
        </Box>
      </Box>

      {/* Bảng dữ liệu */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Đặt Vé</TableCell>
              <TableCell>Tên Người Dùng</TableCell>
              <TableCell>Tên Phim</TableCell>
              <TableCell>Ngày Chiếu</TableCell>
              <TableCell>Phòng Chiếu</TableCell>
              <TableCell>Phương Thức Thanh Toán</TableCell>
              <TableCell>Số Tiền (VNĐ)</TableCell>
              <TableCell>Trạng Thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dashboardData.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((row) => (
              <TableRow key={row.booking_id}>
                <TableCell>{row.booking_id}</TableCell>
                <TableCell>{row.user_name}</TableCell>
                <TableCell>{row.movie_name}</TableCell>
                <TableCell>
        {new Date(row.showtime_date).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </TableCell>
                
                <TableCell>{row.room_name}</TableCell>
                <TableCell>{row.payMethod}</TableCell>
                <TableCell>
  {row.amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
</TableCell>

                <TableCell>{row.status}</TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="d-flex justify-content-center mt-4">
    <Pagination
      current={currentPage}
      pageSize={pageSize}
      total={dashboardData.length}
      onChange={(page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
      }}
    />
  </div>
      </TableContainer>
    </Box>
  );
};

export default MovieStatistics;
