import React from 'react';
import './Dashboard.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import DashboardAdmin from '../../../component/Admin/Dashboard/DashboardAdmin';




function Dashboard() {
    return (
        <div className="app">
            <Sidebar />
            <div className="main">
                <Header />
                <DashboardAdmin/>
            </div>
        </div>
    );
}

export default Dashboard;
