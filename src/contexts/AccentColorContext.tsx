
import React, { createContext, useContext } from 'react';

// Create a simple context with a default green accent color
interface AccentColorContextType {
  accentColor: string;
}

const AccentColorContext = createContext<AccentColorContextType>({ accentColor: 'green' });

export const useAccentColor = () => useContext(AccentColorContext);
