
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type AccentColor = 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'teal';

interface AccentColorProviderProps {
  children: ReactNode;
  defaultColor?: AccentColor;
  storageKey?: string;
}

interface AccentColorContextType {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const initialState: AccentColorContextType = {
  accentColor: 'green',
  setAccentColor: () => null,
};

const AccentColorContext = createContext<AccentColorContextType>(initialState);

export function AccentColorProvider({
  children,
  defaultColor = 'green',
  storageKey = 'zenx-accent-color',
  ...props
}: AccentColorProviderProps) {
  const [accentColor, setAccentColorState] = useState<AccentColor>(
    () => {
      try {
        return (localStorage.getItem(storageKey) as AccentColor) || defaultColor;
      } catch (e) {
        console.warn('LocalStorage not available for accent color, using default', e);
        return defaultColor;
      }
    }
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all accent color classes
    root.classList.remove('accent-green', 'accent-blue', 'accent-purple', 'accent-orange', 'accent-red', 'accent-teal');
    
    // Add the current accent color class
    root.classList.add(`accent-${accentColor}`);
  }, [accentColor]);

  const value = {
    accentColor,
    setAccentColor: (color: AccentColor) => {
      try {
        localStorage.setItem(storageKey, color);
      } catch (e) {
        console.warn('Failed to save accent color to localStorage', e);
      }
      setAccentColorState(color);
    },
  };

  return (
    <AccentColorContext.Provider {...props} value={value}>
      {children}
    </AccentColorContext.Provider>
  );
}

export const useAccentColor = () => {
  const context = useContext(AccentColorContext);
  
  if (context === undefined)
    throw new Error("useAccentColor must be used within an AccentColorProvider");
    
  return context;
};
