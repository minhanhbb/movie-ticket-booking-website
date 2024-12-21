import React, { useEffect, useState } from 'react';
import './RevenueByMovies.css';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import instance from '../../../server';

// Registering Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface ApiResponse {
    status: boolean;
    message: string;
    data: number;
}

const RevenueByMovies = () => {
    const [movieRevenue, setMovieRevenue] = useState<{ movie_id: number; movie_name: string; revenue: number }[]>([]);
    const movieIds = [1, 2, 3, 4 ,5 ,6,7,8,9,10]; // List of movie IDs to fetch revenue data for

    // Bar chart data
    const barData = {
        labels: movieRevenue.map(item => item.movie_name),
        datasets: [
            {
                label: 'Doanh thu theo phim',
                data: movieRevenue.map(item => item.revenue),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    // Pie chart data
    const pieData = {
        labels: movieRevenue.map(item => item.movie_name),
        datasets: [
            {
                label: 'Phân bổ doanh thu',
                data: movieRevenue.map(item => item.revenue),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ],
                borderColor: 'rgba(0, 0, 0, 0.2)',
                borderWidth: 1
            }
        ]
    };

    useEffect(() => {
        const fetchMovieRevenue = async () => {
            try {
                const revenueData = await Promise.all(
                    movieIds.map(async (movie_id) => {
                        const response = await instance.get<ApiResponse>(`/total-revenue-by-movie/${movie_id}`);
                        if (response.data.status) {
                            return {
                                movie_id,
                                movie_name: `Phim ${movie_id}`, // You can replace this with actual movie names if available
                                revenue: response.data.data,
                            };
                        }
                        return { movie_id, movie_name: `Phim ${movie_id}`, revenue: 0 };
                    })
                );
                setMovieRevenue(revenueData);
            } catch (error) {
                console.error('Lỗi khi lấy doanh thu phim:', error);
            }
        };

        fetchMovieRevenue();
    }, []);

    return (
        <div className="revenue-by-movie">
            <h2>Thống kê doanh thu theo phim</h2>
            <div className="chart-container">
                <div className="chart-section">
                    <h3>Doanh thu theo phim</h3>
                    <div className="chart-wrapper">
                        <Bar data={barData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(tooltipItem) {
                                            return `Doanh thu: $${tooltipItem.raw}`;
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    beginAtZero: true
                                },
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }} />
                    </div>
                </div>
                <div className="chart-section">
                    <h3>Phân bổ doanh thu</h3>
                    <div className="chart-wrapper">
                        <Pie data={pieData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(tooltipItem) {
                                            return `Doanh thu: $${tooltipItem.raw}`;
                                        }
                                    }
                                }
                            }
                        }} />
                    </div>
                </div>
            </div>
            <button className="export-btn">Xuất dữ liệu</button>
        </div>
    );
};

export default RevenueByMovies;
