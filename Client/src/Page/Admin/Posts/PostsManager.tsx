import React from 'react';
import './PostsManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import PostsDashboard from '../../../component/Admin/PostsDasboard/PostsDashboard';
import PostDetailManager from '../../../component/Admin/PostsDasboard/PostDetailManager';



function PostsManager() {
    return (
        <div className="postsmanager">
            <Sidebar />
            <div className="postsadmin">
                <Header />
                <PostsDashboard/>
                <PostDetailManager/>
            </div>
        </div>
    );
}

export default PostsManager;
