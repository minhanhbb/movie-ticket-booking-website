import React from 'react';
import './Showtimes.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import ShowtimesForm from '../../../component/Admin/ShowtimesDashboard/ShowtimesForm';





function ShowtimesFormManager() {
    return (
        <div className="showtimesmanager">
            <Sidebar />
            <div className="showtimesadmin">
                <Header />
               <ShowtimesForm/>
            </div>
        </div>
    );  
}

export default ShowtimesFormManager;
