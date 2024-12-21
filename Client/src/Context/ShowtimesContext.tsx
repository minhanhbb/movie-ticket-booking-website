import React, { createContext, useReducer, useContext, ReactNode, useState, useEffect } from 'react';
import instance from '../server';
import { Showtime } from '../interface/Showtimes';
import { Cinema } from '../interface/Cinema';
import { Room } from '../interface/Room';
import { notification } from 'antd';

interface ShowtimeState {
    showtimes: Showtime[];
    cinemas: Cinema[];
    movieInCinemas: any[];
    rooms: Room[];
}

interface ShowtimeAction {
    type: string;
    payload?: any;
}

const initialState: ShowtimeState = {
    showtimes: [],
    cinemas: [],
    movieInCinemas: [],
    rooms: [],
};

const ShowtimeContext = createContext<{
    state: ShowtimeState;
    dispatch: React.Dispatch<ShowtimeAction>;
    addOrUpdateShowtime: (data: Showtime | Showtime[], id?: string) => Promise<void>;
    deleteShowtime: (id: number) => Promise<void>;
    fetchShowtimes: () => Promise<void>;
    fetchCinemas: () => Promise<void>;
    fetchMovieInCinema: (cinemaId: number) => Promise<void>;
    fetchRoomsByCinema: (cinemaId: number) => Promise<void>;
} | undefined>(undefined);

const showtimeReducer = (state: ShowtimeState, action: ShowtimeAction): ShowtimeState => {
    switch (action.type) {
        case 'SET_SHOWTIMES':
            return { ...state, showtimes: action.payload };
        case 'SET_CINEMAS':
            return { ...state, cinemas: action.payload };
        case 'SET_MOVIE_IN_CINEMAS':
            return { ...state, movieInCinemas: action.payload };
        case 'SET_ROOMS':
            return { ...state, rooms: action.payload };
        case 'DELETE_SHOWTIME':
            return { ...state, showtimes: state.showtimes.filter(showtime => showtime.id !== action.payload) };
        case 'ADD_SHOWTIME':
            return { ...state, showtimes: [...state.showtimes, action.payload] };
        case 'ADD_SHOWTIMES':
            return { ...state, showtimes: [...state.showtimes, ...action.payload] };
        case 'UPDATE_SHOWTIME':
            return {
                ...state,
                showtimes: state.showtimes.map(showtime =>
                    showtime.id === action.payload.id ? { ...showtime, ...action.payload } : showtime
                ),
            };
            case 'UPDATE_SHOWTIME_STATUS':
    return {
        ...state,
        showtimes: state.showtimes.map((showtime) =>
            showtime.id === action.payload.id
                ? { ...showtime, status: action.payload.status }
                : showtime
        ),
    };

        default:
            return state;
    }
};

export const ShowtimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(showtimeReducer, initialState);
    const [userRole, setUserRole] = useState<string>("");
    useEffect(() => {
      // Lấy thông tin từ localStorage
      const userData = JSON.parse(localStorage.getItem("user_profile") || "{}");
      const roles = userData.roles || [];
      
      // Lấy vai trò đầu tiên (nếu có)
      if (roles.length > 0) {
        setUserRole(roles[0].name); // Gán vai trò (ví dụ: "staff", "admin")
      }
    }, []);
    const addOrUpdateShowtime = async (data: Showtime | Showtime[], id?: string) => {
        try {
            let response;
            
            if (Array.isArray(data)) {
                const responses = await Promise.all(data.map(async (showtime) => {
                    const response = await instance.post('/manager/showtimes', showtime);
                    if (response.status === 200) {
                        return response.data.data;
                    } else {
                        throw new Error('Failed to add showtime');
                    }
                }));
                dispatch({ type: 'ADD_SHOWTIMES', payload: responses });
             
            } else {
                if (id) {
                    response = await instance.put(`/manager/showtimes/${id}`, data);
                    if (response.status === 200) {
                        dispatch({ type: 'UPDATE_SHOWTIME', payload: response.data });
                        notification.success({
                            message: 'Cập nhật Suất Chiếu Thành Công!',
                            description: 'Suất chiếu đã được cập nhật vào danh sách.',
                          });
                    } else {
                        throw new Error('Failed to update showtime');
                    }
                } else {
                    response = await instance.post('/manager/showtimes', data);
                    if (response.status === 200) {
                        dispatch({ type: 'ADD_SHOWTIME', payload: response.data.data });
                        notification.success({
                            message: 'Thêm Suất Chiếu Thành Công!',
                            description: 'Suất chiếu mới đã được thêm vào danh sách.',
                          });
                    } else {
                        throw new Error('Failed to add showtime');
                    }
                }
            }
        } catch (error) {
            console.error('Error submitting showtime:', error);
            notification.error({
                message: 'Lỗi Trùng Suất Chiếu',
                description: 'Phạm vi thời gian được chọn chồng chéo với các thời gian hiển thị hiện có cho căn phòng này.',
              });
        }
    };

    const deleteShowtime = async (id: number) => {
        try {
            await instance.delete(`/manager/showtimes/${id}`);
            dispatch({ type: 'DELETE_SHOWTIME', payload: id });
        } catch (error) {
            console.error('Error deleting showtime:', error);
        }
    };

    const fetchShowtimes = async () => {
        try {
            const response = await instance.get('/manager/showtimes');
            dispatch({ type: 'SET_SHOWTIMES', payload: response.data.data.data });
        } catch (error) {
            console.error('Error fetching showtimes:', error);
        }
       
    };

    const fetchCinemas = async () => {
        try {
            const response = await instance.get('/cinema');
            dispatch({ type: 'SET_CINEMAS', payload: response.data.data });
        } catch (error) {
            console.error('Error fetching cinemas:', error);
        }
    };

    const fetchMovieInCinema = async (cinemaId: number) => {
        try {
            const response = await instance.get(`/show-movie-in-cinema/${cinemaId}`);
            dispatch({ type: 'SET_MOVIE_IN_CINEMAS', payload: response.data.data });
        } catch (error) {
            console.error('Error fetching movies in cinema:', error);
        }
    };

    const fetchRoomsByCinema = async (cinemaId: number) => {
        try {
            const response = await instance.get(`/cinema/${cinemaId}/room`);
            dispatch({ type: 'SET_ROOMS', payload: response.data.data });
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    return (
        <ShowtimeContext.Provider
            value={{
                state,
                dispatch,
                addOrUpdateShowtime,
                deleteShowtime,
                fetchShowtimes,
                fetchCinemas,
                fetchMovieInCinema,
                fetchRoomsByCinema,
            }}
        >
            {children}
        </ShowtimeContext.Provider>
    );
};

export const useShowtimeContext = () => {
    const context = useContext(ShowtimeContext);
    if (context === undefined) {
        throw new Error('useShowtimeContext must be used within a ShowtimeProvider');
    }
    return context;
};
