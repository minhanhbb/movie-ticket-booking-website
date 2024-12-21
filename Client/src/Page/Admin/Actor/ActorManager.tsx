import React from 'react';
import './ActorManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import ActorDashboard from '../../../component/Admin/ActorDashboard/ActorDashboard';




function ActorManager() {
    return (
        <div className="actormanager">
            <Sidebar />
            <div className="actoradmin">
                <Header />
                <ActorDashboard/>
            </div>
        </div>
    );
}

export default ActorManager;
