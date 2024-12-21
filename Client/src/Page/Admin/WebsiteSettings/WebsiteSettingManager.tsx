import React from 'react';
import './WebsiteSettingManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import ShowtimesDashboard from '../../../component/Admin/ShowtimesDashboard/ShowtimesDashboard';
import WebsiteSettingsForm from '../../../component/Admin/WebsiteSettings/WebsiteSettings';



function WebsiteSettingsManager() {
    return (
        <div className="websitesettingsmanager">
            <Sidebar />
            <div className="websitesettingsadmin">
                <Header />
                <WebsiteSettingsForm/>
            </div>
        </div>
    );
}

export default WebsiteSettingsManager;
