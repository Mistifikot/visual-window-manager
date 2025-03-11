import React, { createContext, useState, useContext } from 'react';
import { initialWindows } from '../constants/initialWindows';

const WindowContext = createContext();

export const WindowProvider = ({ children }) => {
  const [windows, setWindows] = useState(initialWindows);

  const updateWindows = (newWindows) => {
    setWindows(newWindows);
  };

  const updateWindow = (updatedWindow) => {
    setWindows(prevWindows => 
      prevWindows.map(window => 
        window.id === updatedWindow.id ? updatedWindow : window
      )
    );
  };

  return (
    <WindowContext.Provider value={{ windows, updateWindows, updateWindow }}>
      {children}
    </WindowContext.Provider>
  );
};

export const useWindows = () => useContext(WindowContext); 