import React from 'react';
import './ComboManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';

import ComboForm from '../../../component/Admin/ComboDashboard/ComboForm';



function ComboFormManager() {
    return (
        <div className="combomanager">
            <Sidebar />
            <div className="comboadmin">
                <Header />
                <ComboForm/>
            </div>
        </div>
    );
}

export default ComboFormManager;
