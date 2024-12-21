import React from 'react';
import './UserManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import UserDashboard from '../../../component/Admin/UserDashboard/User';



function User() {
    return (
        <div className="usermanager">
            <Sidebar />
            <div className="mainadmin">
                <Header />
                <UserDashboard/>
            </div>
        </div>
    );
}

export default User;
