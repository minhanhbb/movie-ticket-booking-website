import React from 'react';
import './CountriesManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import CountriesForm from '../../../component/Admin/CountriesDashboard/CountriesForm';




function CountriesFormManager() {
    return (
        <div className="countriesmanager">
            <Sidebar />
            <div className="countriesadmin">
                <Header />
                <CountriesForm/>
            </div>
        </div>
    );
}

export default CountriesFormManager;
