import React from 'react';
import './ActorManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import ActorForm from '../../../component/Admin/ActorDashboard/ActorForm';





function ActorFormManager() {
    return (
        <div className="actormanager">
            <Sidebar />
            <div className="actoradmin">
                <Header />
                <ActorForm/>
            </div>
        </div>
    );
}

export default ActorFormManager;
