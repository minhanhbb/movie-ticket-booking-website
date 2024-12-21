import React from 'react';
import './OrdersManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import OrdersDashboard from '../../../component/Admin/OdersDashboard/OrdersDashboard';




function OrdersManager() {
    return (
        <div className="ordersmanager">
            <Sidebar />
            <div className="ordersadmin">
                <Header />
                <OrdersDashboard/>
            </div>
        </div>
    );
}

export default OrdersManager;
