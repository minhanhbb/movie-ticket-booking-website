import React from 'react';
import './SeatMapManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';

import SeatMapForm from '../../../component/Admin/SeatMap/SeatMapForm';







function SeatMapFormManager() {
    return (
        <div className="seatmapmanager">
            <Sidebar />
            <div className="seatmapadmin">
                <Header />
                <SeatMapForm/>
            </div>
        </div>
    );
}

export default SeatMapFormManager;
