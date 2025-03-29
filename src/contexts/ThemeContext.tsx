
import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  theme: string;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'dark' });

export const useTheme = () => useContext(ThemeContext);
