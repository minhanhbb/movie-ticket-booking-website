import React from 'react';
import './Showtimes.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import ShowtimeAuto from '../../../component/Admin/ShowtimesDashboard/ShowtimesAuto';





function ShowtimesAuto() {
    return (
        <div className="showtimesmanager">
            <Sidebar />
            <div className="showtimesadmin">
                <Header />
                <ShowtimeAuto/>
            </div>
        </div>
    );
}

export default ShowtimesAuto;
