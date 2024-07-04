import { createContext, useContext, useReducer } from 'react';

const StoreContext = createContext();

const initialState = {
  user: null,
  // Add other global state properties here
};

const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.user };
    // Add other action types here
    default:
      return state;
  }
};


const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export { StoreProvider, useStore };