import React from 'react';
import './CategoriesManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import CategoriesForm from '../../../component/Admin/CategoriesDashboard/CategoriesForm';



function CategoriesFormManager() {
    return (
        <div className="categoriesmanager">
            <Sidebar />
            <div className="categoriesadmin">
                <Header />
                <CategoriesForm/>
            </div>
        </div>
    );
}

export default CategoriesFormManager;
