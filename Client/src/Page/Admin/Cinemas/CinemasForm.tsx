import React from 'react';
import './CinemasManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import CinemaForm from '../../../component/Admin/CinemasDashboard/CinemasForm';


function CinemasFormManager() {
    return (
        <div className="cinemasmanager">
            <Sidebar />
            <div className="cinemasadmin">
                <Header />
                <CinemaForm/>
            </div>
        </div>
    );
}

export default CinemasFormManager;
