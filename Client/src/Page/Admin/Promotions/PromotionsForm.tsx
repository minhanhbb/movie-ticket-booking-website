import React from 'react';
import './PromotionsManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';

import PromotionForm from '../../../component/Admin/Promotions/PromotionsForm';




function PromotionsFormManager() {
    return (
        <div className="promotionsmanager">
            <Sidebar />
            <div className="promotionsadmin">
                <Header />
                <PromotionForm/>
            </div>
        </div>
    );
}

export default PromotionsFormManager;
