import React from 'react';
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import './RankManager.css'
import RankDashboard from '../../../component/Admin/RankDashboard/RankDashboard';
import RankForm from '../../../component/Admin/RankDashboard/RankForm';


function RankFormManager() {
    return (
        <div className="rankmanager">
            <Sidebar />
            <div className="rankadmin">
                <Header />
                <RankForm/>
            </div>
        </div>
    );
}

export default RankFormManager;
