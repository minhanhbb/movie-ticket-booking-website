import React from 'react';
import './OrdersManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import OrdersDashboard from '../../../component/Admin/OdersDashboard/OrdersDashboard';
import OrderDetail from '../../../component/Admin/OdersDashboard/OrdersDetail';




function OrdersDetailManager() {
    return (
        <div className="ordersmanager">
            <Sidebar />
            <div className="ordersadmin">
                <Header />
                <OrderDetail/>
            </div>
        </div>
    );
}

export default OrdersDetailManager;
