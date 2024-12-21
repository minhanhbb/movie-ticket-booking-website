import React from 'react';
import './SeatMapManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import SeatMap from '../../../component/Admin/SeatMap/SeatMap';






function SeatMapManager() {
    return (
        <div className="seatmapmanager">
            <Sidebar />
            <div className="seatmapadmin">
                <Header />
                <SeatMap/>
            </div>
        </div>
    );
}

export default SeatMapManager;
