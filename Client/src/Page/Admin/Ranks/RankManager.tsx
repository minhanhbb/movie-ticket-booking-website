import React from 'react';
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import './RankManager.css'
import RankDashboard from '../../../component/Admin/RankDashboard/RankDashboard';


function RankManager() {
    return (
        <div className="rankmanager">
            <Sidebar />
            <div className="rankadmin">
                <Header />
                <RankDashboard/>
            </div>
        </div>
    );
}

export default RankManager;
