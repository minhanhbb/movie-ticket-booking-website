import React from 'react';
import './SchedulesManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import UserDashboard from '../../../component/Admin/UserDashboard/User';
import SchedulesDashboard from '../../../component/Admin/SchedulesDashboard/SchedulesDashboard';


function SchedulesManager() {
    return (
        <div className="schedulesmanager">
            <Sidebar />
            <div className="schedulesadmin">
                <Header />
                <SchedulesDashboard/>
            </div>
        </div>
    );
}

export default SchedulesManager;
