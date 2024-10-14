// src/context/NavigationContext.js

import React, { createContext, useState } from 'react';

export const NavigationContext = createContext();

const NavigationProvider = ({ children }) => {
  const [navigationDirection, setNavigationDirection] = useState('forward');

  return (
    <NavigationContext.Provider value={{ navigationDirection, setNavigationDirection }}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;
