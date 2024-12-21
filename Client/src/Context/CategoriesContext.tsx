import React, { createContext, useReducer, useContext, useEffect, useState } from 'react';
import instance from '../server';
import { MovieCategory } from '../interface/MovieCategory';

// Define action types
type Action =
  | { type: 'SET_CATEGORIES'; payload: MovieCategory[] }
  | { type: 'ADD_CATEGORY'; payload: MovieCategory }
  | { type: 'UPDATE_CATEGORY'; payload: MovieCategory }
  | { type: 'DELETE_CATEGORY'; payload: number };

// Define the initial state type
interface CategoryState {
  categories: MovieCategory[];
  loading: boolean;
}

// Create context
const CategoryContext = createContext<{
  state: CategoryState;
  dispatch: React.Dispatch<Action>;
  addCategory: (category: MovieCategory) => Promise<void>;
  updateCategory: (id: number, category: MovieCategory) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
} | undefined>(undefined);

// Reducer function
const categoryReducer = (state: CategoryState, action: Action): CategoryState => {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload, loading: false };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
      };
    default:
      return state;
  }
};

// Create a provider component
export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(categoryReducer, { categories: [], loading: true });
  const [userRole, setUserRole] = useState<string>("");
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_profile") || "{}");
    const roles = userData.roles || [];
   
    if (roles.length > 0) {
      setUserRole(roles[0].name);
    } else {
      setUserRole("unknown"); // Gán giá trị mặc định khi không có vai trò
    }
  }, []);
  const fetchCategories = async () => {
    try {
      let response;
      if (userRole === "manager") {
        response = await instance.get('/manager/movie-category');
      } else {
        response = await instance.get('/movie-category');
      }
      dispatch({ type: 'SET_CATEGORIES', payload: response.data.data }); // Assuming response.data contains the categories
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories when the provider mounts
  }, []);

  // Function to add a new category
  const addCategory = async (category: MovieCategory) => {
    try {
      const response = await instance.post('/manager/movie-category', category);
      dispatch({ type: 'ADD_CATEGORY', payload: response.data }); // Dispatch add action
      fetchCategories(); // Re-fetch categories after adding
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  // Function to update an existing category
  const updateCategory = async (id: number, category: MovieCategory) => {
    try {
      const response = await instance.patch(`/manager/movie-category/${id}`, category);
      dispatch({ type: 'UPDATE_CATEGORY', payload: response.data }); // Dispatch update action
      fetchCategories(); // Re-fetch categories after updating
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  // Function to delete a category
  const deleteCategory = async (id: number) => {
    try {
      await instance.delete(`/manager/movie-category/${id}`);
      dispatch({ type: 'DELETE_CATEGORY', payload: id }); // Dispatch delete action
      fetchCategories(); // Re-fetch categories after deleting
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <CategoryContext.Provider value={{ state, dispatch, addCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

// Custom hook to use the CategoryContext
export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
};
