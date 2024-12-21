import React from 'react';
import './MoviesManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import MovieForm from '../../../component/Admin/MoviesDashboard/MovieForm';






function MoviesAddManager() {
    return (
        <div className="moviesmanager">
            <Sidebar />
            <div className="moviesadmin">
                <Header />
            <MovieForm/>
            </div>
        </div>
    );
}

export default MoviesAddManager;
