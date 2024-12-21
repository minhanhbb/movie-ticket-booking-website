import React from 'react';
import './CategoriesManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import CategoriesDashboard from '../../../component/Admin/CategoriesDashboard/CategoriesDashboard';



function CategoriesManager() {
    return (
        <div className="categoriesmanager">
            <Sidebar />
            <div className="categoriesadmin">
                <Header />
                <CategoriesDashboard/>
            </div>
        </div>
    );
}

export default CategoriesManager;
