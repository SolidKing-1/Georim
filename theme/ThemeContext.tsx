import React, { createContext, useContext, useState } from "react";

const lightTheme = {
  background: "#fff",
  text: "#222",
  primary: "#7F00FF",
  inputBackground: "#f4f4f4",
  inputText: "#222",
  buttonBackground: "#7F00FF",
  buttonText: "#fff",
};

const darkTheme = {
  background: "#181828",
  text: "#fff",
  primary: "#7F00FF",
  inputBackground: "#23233a",
  inputText: "#fff",
  buttonBackground: "#7F00FF",
  buttonText: "#fff",
};

const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
