import React from 'react';
import './PromotionsManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import PromotionsDashboard from '../../../component/Admin/Promotions/Promotions';




function PromotionsManager() {
    return (
        <div className="promotionsmanager">
            <Sidebar />
            <div className="promotionsadmin">
                <Header />
                <PromotionsDashboard/>
            </div>
        </div>
    );
}

export default PromotionsManager;
