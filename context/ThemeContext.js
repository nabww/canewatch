// ThemeContext.js
import React, { createContext, useState, useContext } from "react";
import { DefaultTheme, DarkTheme } from "react-native-paper";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        theme: isDarkMode ? DarkTheme : DefaultTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
