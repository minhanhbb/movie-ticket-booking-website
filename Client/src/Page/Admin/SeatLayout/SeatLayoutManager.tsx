import React from 'react';
import './SeatLayoutManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import SeatLayoutDashboard from '../../../component/Admin/SeatLayout/SeatLayout';






function SeatLayoutManager() {
    return (
        <div className="seatlayoutmanager">
            <Sidebar />
            <div className="seatlayoutadmin">
                <Header />
                <SeatLayoutDashboard/>
            </div>
        </div>
    );
}

export default SeatLayoutManager;
