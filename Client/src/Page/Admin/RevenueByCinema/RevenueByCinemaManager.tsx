import React from 'react';
import './RevenueByCinemaManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';

import RevenueByCinema from '../../../component/Admin/RevenueByCinema/RevenueByCinema';


function RevenueByCinemaManager() {
    return (
        <div className="revenuebycinemamanager">
            <Sidebar />
            <div className="revenuebycinemaadmin">
                <Header />
               <RevenueByCinema/>
            </div>
        </div>
    );
}

export default RevenueByCinemaManager;
