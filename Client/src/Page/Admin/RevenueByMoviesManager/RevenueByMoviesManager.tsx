import React from 'react';
import './RevenueByMoviesManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';

import RevenueByMovies from '../../../component/Admin/RevenueByMovies/RevenueByMovies';


function RevenueByMoviesManager() {
    return (
        <div className="revenuebymoviesmanager">
            <Sidebar />
            <div className="revenuebymoviesadmin">
                <Header />
                <RevenueByMovies/>
            </div>
        </div>
    );
}

export default RevenueByMoviesManager;
