import React from 'react';
import './DirectorManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import DirectorDashboard from '../../../component/Admin/DirectorDashboard/DirectorDashboard';





function DirectorManager() {
    return (
        <div className="directormanager">
            <Sidebar />
            <div className="directoradmin">
                <Header />
                <DirectorDashboard/>
            </div>
        </div>
    );
}

export default DirectorManager;
