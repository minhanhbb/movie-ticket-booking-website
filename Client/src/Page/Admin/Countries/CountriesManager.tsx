import React from 'react';
import './CountriesManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';

import CountriesDashboard from '../../../component/Admin/CountriesDashboard/CountriesDashboard';


function CountriesManager() {
    return (
        <div className="countriesmanager">
            <Sidebar />
            <div className="countriesadmin">
                <Header />
                <CountriesDashboard/>
            </div>
        </div>
    );
}

export default CountriesManager;
