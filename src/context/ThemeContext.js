import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { lightTheme, darkTheme } from '../theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(colorScheme === 'dark' ? darkTheme : lightTheme);
  const [mode, setMode] = useState(colorScheme);

  useEffect(() => {
    const listener = ({ colorScheme }) => {
      setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
      setMode(colorScheme);
    };
    Appearance.addChangeListener(listener);
    return () => Appearance.removeChangeListener(listener);
  }, []);

  const toggleTheme = () => {
    if (mode === 'dark') {
      setTheme(lightTheme);
      setMode('light');
    } else {
      setTheme(darkTheme);
      setMode('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
