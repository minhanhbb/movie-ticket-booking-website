import React from 'react';
import './PostsManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import PostsForm from '../../../component/Admin/PostsDasboard/PostsForm';





function PostsFormManager() {
    return (
        <div className="postsmanager">
            <Sidebar />
            <div className="postsadmin">
                <Header />
                <PostsForm/>
            </div>
        </div>
    );
}

export default PostsFormManager;
