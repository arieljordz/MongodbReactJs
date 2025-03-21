import { createContext, useContext, useState, useEffect } from "react";

// Create Theme Context
const ThemeContext = createContext();

// Custom Hook to use Theme
export const useTheme = () => useContext(ThemeContext);

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [navBgColor, setNavBgColor] = useState(
    localStorage.getItem("navBgColor") || "default"
  );
  const [cardBgColor, setCardBgColor] = useState(
    localStorage.getItem("cardBgColor") || "default"
  );
  const [btnBgColor, setBtnBgColor] = useState(
    localStorage.getItem("cardBgColor") || "default"
  );

  const colorMapping = {
    "navbar-light": { cardColor: "card-light", btnColor: "btn-light" },
    "navbar-dark": { cardColor: "card-dark", btnColor: "btn-dark" },
    "navbar-primary": { cardColor: "card-primary", btnColor: "btn-primary" },
    "navbar-secondary": { cardColor: "card-secondary", btnColor: "btn-secondary" },
    "navbar-info": { cardColor: "card-info", btnColor: "btn-info" },
    "navbar-success": { cardColor: "card-success", btnColor: "btn-success" },
    "navbar-warning": { cardColor: "card-warning", btnColor: "btn-warning" },
    "navbar-danger": { cardColor: "card-danger", btnColor: "btn-danger" },
  };

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Toggle navbar background color
  const toggleNavBar = (navColor) => {
    // Get corresponding colors for card and button
    const { cardColor, btnColor } = colorMapping[navColor] || {
      cardColor: "card-default",
      btnColor: "btn-default",
    };

    console.log(navColor, cardColor, btnColor);

    setNavBgColor(navColor);
    setCardBgColor(cardColor);
    setBtnBgColor(cardColor);
    localStorage.setItem("navBgColor", navColor);
    localStorage.setItem("cardBgColor", cardColor);
    localStorage.setItem("btnBgColor", btnColor);
  };

  // Apply theme to body class
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, navBgColor, toggleNavBar, cardBgColor, btnBgColor }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
