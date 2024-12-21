import React from 'react';
import './MovieStatisticsManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import MovieStatistics from '../../../component/Admin/MovieStatistics/MovieStatistics';




function MovieStatisticsManager() {
    return (
        <div className="moviestatisticsmanager">
            <Sidebar />
            <div className="moviestatisticsadmin">
                <Header />
                <MovieStatistics/>
            </div>
        </div>
    );
}

export default MovieStatisticsManager;
