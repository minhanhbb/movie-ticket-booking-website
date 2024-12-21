import React, { createContext, useReducer, useContext, useEffect, useState } from 'react';
import { Combo } from '../interface/Combo';
import instance from '../server';

// Define action types
type Action =
  | { type: 'SET_COMBOS'; payload: Combo[] }
  | { type: 'ADD_COMBO'; payload: Combo }
  | { type: 'UPDATE_COMBO'; payload: Combo }
  | { type: 'DELETE_COMBO'; payload: number }
  | { type: 'UPDATE_COMBO_STATUS'; payload: { id: number; status: boolean }}

// Define the initial state type
interface ComboState {
  combos: Combo[];
}

// Create context
const ComboContext = createContext<{
  state: ComboState;
  dispatch: React.Dispatch<Action>;
  addCombo: (combo: Combo) => Promise<void>;
  updateCombo: (id: number, combo: Combo) => Promise<void>;
  deleteCombo: (id: number) => Promise<void>;
} | undefined>(undefined);

// Reducer function
const comboReducer = (state: ComboState, action: Action): ComboState => {
  
  switch (action.type) {
    case 'SET_COMBOS':
      return { ...state, combos: action.payload };
    case 'ADD_COMBO':
      return { ...state, combos: [...state.combos, action.payload] };
    case 'UPDATE_COMBO':
      return {
        ...state,
        combos: state.combos.map(combo =>
          combo.id === action.payload.id ? action.payload : combo
        ),
      };
    case 'DELETE_COMBO':
      return {
        ...state,
        combos: state.combos.filter(combo => combo.id !== action.payload),
      };
      case 'UPDATE_COMBO_STATUS':
        return {
          ...state,
          combos: state.combos.map(combo =>
            combo.id === action.payload.id
              ? { ...combo, status: action.payload.status ? 1 : 0 } // Chuyển boolean về dạng số nếu cần
              : combo
          ),
        };

    default:
      return state;
  }
};

// Provider component
export const ComboProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(comboReducer, { combos: [] });
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
const fetchCombos = async () => {
 
  try {
    if (userRole === "manager") {
    const { data } = await instance.get('/manager/combo', {
    });
    dispatch({ type: 'SET_COMBOS', payload: data.data });
  }
  } catch (error) {
    console.error('Failed to fetch combos:', error);
  }

};


  const addCombo = async (combo: Combo) => {
    try {
      const { data } = await instance.post('/manager/combo', combo);
      dispatch({ type: 'ADD_COMBO', payload: data.data });
      fetchCombos()
    } catch (error) {
      console.error('Failed to add combo:', error);
    }
  };
const updateCombo = async (id: number, combo: Combo) => {
try {
      const { data } = await instance.put(`/manager/combo/${id}`, combo);
      dispatch({ type: 'UPDATE_COMBO', payload: data.data });
    } catch (error) {
      console.error('Failed to update combo:', error);
    }
  };

  const deleteCombo = async (id: number) => {
    try {
      await instance.delete(`/manager/combo/${id}`);
      dispatch({ type: 'DELETE_COMBO', payload: id });
    } catch (error) {
      console.error('Failed to delete combo:', error);
    }
  };

  useEffect(() => {
    if (userRole !== "") {
      fetchCombos();
    }
  }, [userRole]);

  return (
    <ComboContext.Provider value={{ state, dispatch, addCombo, updateCombo, deleteCombo }}>
      {children}
    </ComboContext.Provider>
  );
};

// Custom hook to use the Combo context
export const useComboContext = () => {
  const context = useContext(ComboContext);
  if (!context) {
    throw new Error('useComboContext must be used within a ComboProvider');
  }
  return context;
};