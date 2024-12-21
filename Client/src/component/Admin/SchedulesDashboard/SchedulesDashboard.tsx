import React from 'react';
import './SchedulesDashboard.css';

const SchedulesDashboard = () => {
    const schedules = [
        { id: 'SCH001', movie: 'Inception', date: '2024-10-01', time: '19:00', hall: 'Hall 1' },
        { id: 'SCH002', movie: 'The Matrix', date: '2024-10-02', time: '21:00', hall: 'Hall 2' },
        { id: 'SCH003', movie: 'Interstellar', date: '2024-10-03', time: '18:00', hall: 'Hall 3' },
    ];
    return (
        <div className="schedules-management">
            <h2>Schedule Management</h2>
            <div className="actions">
                <button className="add-schedule-btn">Add New Schedule</button>
            </div>
            <div className="table-container">
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th>Schedule ID</th>
                            <th>Movie</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Hall</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map((schedule) => (
                            <tr key={schedule.id}>
                                <td>{schedule.id}</td>
                                <td>{schedule.movie}</td>
                                <td>{schedule.date}</td>
                                <td>{schedule.time}</td>
                                <td>{schedule.hall}</td>
                                <td className="action-buttons">
                                    <button className="view-btn">👁</button>
                                    <button className="edit-btn">✏️</button>
                                    <button className="delete-btn">🗑</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SchedulesDashboard;
