import React from 'react';
import './UserManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import UserAdd from '../../../component/Admin/UserDashboard/Roles';





function UserAddManager() {
    return (
        <div className="usermanager">
            <Sidebar />
            <div className="mainadmin">
                <Header />
                <UserAdd/>
            </div>
        </div>
    );
}

export default UserAddManager;
