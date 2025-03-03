import { createContext, useContext, useState, useEffect } from "react";

// Create Theme Context
const ThemeContext = createContext();

// Custom Hook to use Theme
export const useTheme = () => useContext(ThemeContext);

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Save theme preference
  };

  // Apply theme to body class
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children} {/* Ensure children are wrapped inside the provider */}
    </ThemeContext.Provider>
  );
};
