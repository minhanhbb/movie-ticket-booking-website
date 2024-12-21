import React, { createContext, useReducer, useContext, useEffect, useState } from 'react';
import { Cinema } from '../interface/Cinema';
import instance from '../server';

// Define action types
type Action =
  | { type: 'SET_CINEMAS'; payload: Cinema[] }
  | { type: 'ADD_CINEMA'; payload: Cinema }
  | { type: 'UPDATE_CINEMA'; payload: Cinema }
  | { type: 'DELETE_CINEMA'; payload: number };

// Define the initial state type
interface CinemaState {
  cinemas: Cinema[];
}

// Create context
const CinemaContext = createContext<{
  state: CinemaState;
  dispatch: React.Dispatch<Action>;
  addCinema: (cinema: Cinema) => Promise<void>;
  updateCinema: (id: number, cinema: Cinema) => Promise<void>;
  deleteCinema: (id: number) => Promise<void>;
} | undefined>(undefined);

// Reducer function
const cinemaReducer = (state: CinemaState, action: Action): CinemaState => {
  switch (action.type) {
    case 'SET_CINEMAS':
      return { ...state, cinemas: action.payload };
    case 'ADD_CINEMA':
      return { ...state, cinemas: [...state.cinemas, action.payload] };
    case 'UPDATE_CINEMA':
      return {
        ...state,
        cinemas: state.cinemas.map(cinema =>
          cinema.id === action.payload.id ? action.payload : cinema
        ),
      };
    case 'DELETE_CINEMA':
      return {
        ...state,
        cinemas: state.cinemas.filter(cinema => cinema.id !== action.payload),
      };
    default:
      return state;
  }
};

// Create a provider component
export const CinemaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cinemaReducer, { cinemas: [] });
  const [userRole, setUserRole] = useState<string>("");

  // Fetch user role from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_profile") || "{}");
    const roles = userData.roles || [];
   
    if (roles.length > 0) {
      setUserRole(roles[0].name);
    } else {
      setUserRole("unknown"); // Gán giá trị mặc định khi không có vai trò
    }
  }, []);
  
  

  // Fetch cinemas based on user role
  const fetchCinemas = async () => {
    try {
      let response;
      if (userRole === "admin") {
        response = await instance.get('/admin/cinema');
      } else if (userRole === "staff") {
        response = await instance.get('/staff/cinema');
      } else if (userRole === "manager") {
        response = await instance.get('/manager/cinema');
      } else {
        response = await instance.get('/cinema');
      }

      dispatch({ type: 'SET_CINEMAS', payload: response.data.data });
    } catch (error) {
      console.error('Failed to fetch cinemas:', error);
    }
  };

  useEffect(() => {
    if (userRole !== "") {
      fetchCinemas();
    }
  }, [userRole]);

  // Add cinema
  const addCinema = async (cinema: Cinema) => {
    try {
      let response;
      if (userRole === "admin") {
        response = await instance.post('/admin/cinema',cinema);
      }else if (userRole === "manager") {
        response = await instance.post('/manager/cinema',cinema);
      } else {
        response = await instance.post('/cinema',cinema);
      }

      dispatch({ type: 'ADD_CINEMA', payload: response.data});
      fetchCinemas();
    } catch (error) {
      console.error('Failed to add cinema:', error);
    }
  };

  // Update cinema
 // Update cinema
const updateCinema = async (id: number, cinema: Cinema) => {
  try {
    let response;
    if (userRole === "admin") {
      response = await instance.patch(`/admin/cinema/${id}`, cinema);
    } else if (userRole === "staff") {
      response = await instance.patch(`/staff/cinema/${id}`, cinema);
    } else if (userRole === "manager") {
      response = await instance.patch(`/manager/cinema/${id}`, cinema);
    } else {
      // Trường hợp không có quyền hoặc vai trò không hợp lệ
      throw new Error("Unauthorized to update cinema");
    }

    dispatch({ type: 'UPDATE_CINEMA', payload: response.data });
    fetchCinemas(); // Cập nhật danh sách rạp chiếu
  } catch (error) {
    console.error('Failed to update cinema:', error);
  }
};


  // Delete cinema
 // Delete cinema
const deleteCinema = async (id: number) => {
  try {
    if (userRole === "admin") {
      await instance.delete(`/admin/cinema/${id}`);
    } else if (userRole === "staff") {
      await instance.delete(`/staff/cinema/${id}`);
    } else if (userRole === "manager") {
      await instance.delete(`/manager/cinema/${id}`);
    } else {
      // Trường hợp không có quyền hoặc vai trò không hợp lệ
      throw new Error("Unauthorized to delete cinema");
    }

    dispatch({ type: 'DELETE_CINEMA', payload: id });
    fetchCinemas(); // Cập nhật danh sách rạp chiếu
  } catch (error) {
    console.error('Failed to delete cinema:', error);
  }
};


  return (
    <CinemaContext.Provider value={{ state, dispatch, addCinema, updateCinema, deleteCinema }}>
      {children}
    </CinemaContext.Provider>
  );
};

// Custom hook to use the CinemaContext
export const useCinemaContext = () => {
  const context = useContext(CinemaContext);
  if (!context) {
    throw new Error('useCinemaContext must be used within a CinemaProvider');
  }
  return context;
};
