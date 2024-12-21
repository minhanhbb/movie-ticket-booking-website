import React from 'react';
import './RoomsManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import RoomsForm from '../../../component/Admin/RoomsDashboard/RoomsForm';






function RoomsFormManager() {
    return (
        <div className="roomsmanager">
            <Sidebar />
            <div className="roomsadmin">
                <Header />
                <RoomsForm/>
            </div>
        </div>
    );
}

export default RoomsFormManager;
