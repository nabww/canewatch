import React, { createContext, useState, useContext } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDarkTheme, setIsDarkTheme] = useState(colorScheme === "dark");

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  const themeStyles = {
    dark: {
      background: "#000000",
      text: "#FFFFFF",
      border: "#666666",
    },
    light: {
      background: "#FFFFFF",
      text: "#000000",
      border: "#DDDDDD",
    },
  };

  const currentTheme = isDarkTheme ? themeStyles.dark : themeStyles.light;

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
