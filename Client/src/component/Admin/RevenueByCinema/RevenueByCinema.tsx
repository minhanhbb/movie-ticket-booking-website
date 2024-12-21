import React, { useEffect, useState } from 'react';
import './RevenueByCinema.css';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, ArcElement } from 'chart.js';
import instance from '../../../server';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, ArcElement);

interface ApiResponse {
    status: boolean;
    message: string;
    data: number;
}

const RevenueByCinema = () => {
    const [paidRevenue, setPaidRevenue] = useState(0);
    const [pendingRevenue, setPendingRevenue] = useState(0);
    const [confirmedRevenue, setConfirmedRevenue] = useState(0);
    const [cinemaRevenue, setCinemaRevenue] = useState<{ cinema_id: number; cinema_name: string; revenue: number }[]>([]);
    const cinemaIds = [1, 2, 3, 4];

    const areaData = {
        labels: cinemaRevenue.map(item => item.cinema_name),
        datasets: [
            {
                label: 'Doanh thu',
                data: cinemaRevenue.map(item => item.revenue),
                backgroundColor: 'rgba(39, 174, 96, 0.4)',
                borderColor: '#27ae60',
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    const pieData = {
        labels: cinemaRevenue.map(item => item.cinema_name),
        datasets: [
            {
                label: 'Phân phối doanh thu',
                data: cinemaRevenue.map(item => item.revenue),
                backgroundColor: ['#27ae60', '#3498db', '#e74c3c', '#f1c40f', '#9b59b6'],
                borderColor: '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    useEffect(() => {
        const fetchPaidRevenue = async () => {
            try {
                const response = await instance.get<ApiResponse>('/total-revenue/pain');
                if (response.data.status) {
                    setPaidRevenue(response.data.data);
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            }
        };
        const fetchPendingRevenue = async () => {
            try {
                const response = await instance.get<ApiResponse>('/total-revenue/pending');
                if (response.data.status) {
                    setPendingRevenue(response.data.data);
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            }
        };
        const fetchConfirmedRevenue = async () => {
            try {
                const response = await instance.get<ApiResponse>('/total-revenue/confirmed');
                if (response.data.status) {
                    setConfirmedRevenue(response.data.data);
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            }
        };
        const fetchCinemaRevenue = async () => {
            try {
                const revenueData = await Promise.all(
                    cinemaIds.map(async (cinema_id) => {
                        const response = await instance.get(`/total-revenue-cinema/${cinema_id}`);
                        if (response.data.status) {
                            return {
                                cinema_id,
                                cinema_name: `Rạp ${cinema_id}`,
                                revenue: response.data.data,
                            };
                        }
                        return { cinema_id, cinema_name: `Rạp ${cinema_id}`, revenue: 0 };
                    })
                );
                setCinemaRevenue(revenueData);
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            }
        };
        fetchCinemaRevenue();
        fetchConfirmedRevenue();
        fetchPendingRevenue();
        fetchPaidRevenue();
    }, []);

    return (
        <div className="revenue-display">
            <h2>Tổng quan doanh thu</h2>
            <div className="summary-container">
                <div className="summary-card" style={{ background: 'linear-gradient(to right, #ffafbd, #ffc3a0)' }}>
                    <h3>Đã thanh toán</h3>
                    <p className="total-revenue">{paidRevenue.toLocaleString('vi-VN')}₫</p>
                </div>
                <div className="summary-card" style={{ background: 'linear-gradient(to right, #36d1dc, #5b86e5)' }}>
                    <h3>Chờ thanh toán</h3>
                    <p className="total-revenue">{pendingRevenue.toLocaleString('vi-VN')}₫</p>
                </div>
                <div className="summary-card" style={{ background: 'linear-gradient(to right, #96fbc4, #96fbc4)' }}>
                    <h3>Chưa thanh toán</h3>
                    <p className="total-revenue">{confirmedRevenue.toLocaleString('vi-VN')}₫</p>
                </div>
            </div>

            <div className="chart-container">
                <div className="chart-section1">
                    <h3>Doanh thu theo rạp (Biểu đồ vùng)</h3>
                    <Line
    data={areaData}
    options={{
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw as number; // Ép kiểu context.raw sang number
                        return `${value.toLocaleString('vi-VN')}₫`;
                    },
                },
            },
        },
        scales: {
            x: { title: { display: true, text: 'Các rạp' } },
            y: {
                title: { display: true, text: 'Doanh thu (VND)' },
                ticks: {
                    callback: (value) => `${value.toLocaleString('vi-VN')}₫`,
                },
            },
        },
    }}
/>

                </div>
                <div className="chart-section2">
                    <h3>Phân phối doanh thu (Biểu đồ tròn)</h3>
                    <Pie
    data={pieData}
    options={{
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw as number; // Ép kiểu context.raw sang number
                        return `${context.label}: ${value.toLocaleString('vi-VN')}₫`;
                    },
                },
            },
        },
    }}
/>

                </div>
            </div>
            <button className="export-btn">Xuất báo cáo</button>
        </div>
    );
};

export default RevenueByCinema;
