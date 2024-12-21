import React from 'react';
import './DirectorManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import DirectorForm from '../../../component/Admin/DirectorDashboard/DirectorForm';






function DirectorFormManager() {
    return (
        <div className="directormanager">
            <Sidebar />
            <div className="directoradmin">
                <Header />
                <DirectorForm/>
            </div>
        </div>
    );
}

export default DirectorFormManager;
