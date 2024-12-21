import React from 'react';
import './ComboManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import ComboDashboard from '../../../component/Admin/ComboDashboard/ComboDashboard';



function ComboManager() {
    return (
        <div className="combomanager">
            <Sidebar />
            <div className="comboadmin">
                <Header />
                <ComboDashboard/>
            </div>
        </div>
    );
}

export default ComboManager;
