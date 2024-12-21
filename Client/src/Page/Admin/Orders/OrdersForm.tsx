import React from 'react';
import './OrdersManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import OrdersForm from '../../../component/Admin/OdersDashboard/OrdersForm';




function OrdersFormManager() {
    return (
        <div className="ordersmanager">
            <Sidebar />
            <div className="ordersadmin">
                <Header />
                <OrdersForm/>
            </div>
        </div>
    );
}

export default OrdersFormManager;
