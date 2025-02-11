import React, { createContext, useState, useContext } from 'react';

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [sharedState, setSharedState] = useState(import.meta.env.VITE_THEME);

  return (
    <StateContext.Provider value={[sharedState, setSharedState]}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
export const StateConsumer = ({ children }) => {
  const [sharedState] = useStateValue(); // Using the custom hook to get the shared state
  return children(sharedState);
  
};