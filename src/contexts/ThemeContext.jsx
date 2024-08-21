import { createContext, useContext, useState, useEffect } from "react";

// Create a context for the theme
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Provider component to wrap the app and provide the theme state and setter
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "system"
  );

  const element = document.documentElement;
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  // Function to update the theme based on the selected option
  const updateTheme = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  // Apply the appropriate theme when the component mounts
  useEffect(() => {
    const applyTheme = () => {
      switch (theme) {
        case "dark":
          element.classList.add("dark");
          localStorage.setItem("theme", "dark");
          break;

        case "light":
          element.classList.remove("dark");
          localStorage.setItem("theme", "light");
          break;

        default:
          localStorage.removeItem("theme");
          if (darkQuery.matches) {
            element.classList.add("dark");
          } else {
            element.classList.remove("dark");
          }
          break;
      }
    };

    applyTheme();
  }, [theme, darkQuery]);

  // Create a context value object
  const contextValue = {
    theme,
    updateTheme,
  };

  // Provide the context value to the app
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
