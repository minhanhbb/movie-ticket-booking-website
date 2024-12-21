import React from 'react';
import './MoviesManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import MoviesDashboard from '../../../component/Admin/MoviesDashboard/MoviesDashboard';





function MoviesManager() {
    return (
        <div className="moviesmanager">
            <Sidebar />
            <div className="moviesadmin">
                <Header />
                    <MoviesDashboard/>
            </div>
        </div>
    );
}

export default MoviesManager;
