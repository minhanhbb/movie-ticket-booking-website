import React from 'react';
import './SeatLayoutManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';

import SeatLayoutForm from '../../../component/Admin/SeatLayout/SeatLayoutForm';






function SeatLayoutFormManager() {
    return (
        <div className="seatlayoutmanager">
            <Sidebar />
            <div className="seatlayoutadmin">
                <Header />
                <SeatLayoutForm/>
            </div>
        </div>
    );
}

export default SeatLayoutFormManager;
