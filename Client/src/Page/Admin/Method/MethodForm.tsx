import React from 'react';
import './MethodManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';


import PayMethodDashboard from '../../../component/Admin/MethodDashboard/MethodDashboard';
import MethodForm from '../../../component/Admin/MethodDashboard/MethodForm';


function MethodFormManager() {
    return (
        <div className="methodmanager">
            <Sidebar />
            <div className="methodadmin">
                <Header />
                <MethodForm/>
            </div>
        </div>
    );
}

export default MethodFormManager;
