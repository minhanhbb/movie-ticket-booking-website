import React from 'react';
import './RoomsManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import RoomDashboard from '../../../component/Admin/RoomsDashboard/RoomsDashboard';





function RoomsManager() {
    return (
        <div className="roomsmanager">
            <Sidebar />
            <div className="roomsadmin">
                <Header />
                <RoomDashboard/>
              
            </div>
        </div>
    );
}

export default RoomsManager;
