import React from 'react';
import './MethodManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';


import PayMethodDashboard from '../../../component/Admin/MethodDashboard/MethodDashboard';


function MethodManager() {
    return (
        <div className="methodmanager">
            <Sidebar />
            <div className="methodadmin">
                <Header />
                <PayMethodDashboard/>
            </div>
        </div>
    );
}

export default MethodManager;
