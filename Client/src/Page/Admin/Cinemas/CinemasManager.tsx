import React from 'react';
import './CinemasManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import CinemasDashboard from '../../../component/Admin/CinemasDashboard/CinemasDashboard';


function CinemasManager() {
    return (
        <div className="cinemasmanager">
            <Sidebar />
            <div className="cinemasadmin">
                <Header />
               <CinemasDashboard/>
            </div>
        </div>
    );
}

export default CinemasManager;
