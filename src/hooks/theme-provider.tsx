
import { createContext, useContext } from 'react';

interface ThemeProviderState {
  theme: string;
  setTheme: (theme: string) => void;
}

const initialState: ThemeProviderState = {
  theme: 'dark',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export const useTheme = () => useContext(ThemeProviderContext);
