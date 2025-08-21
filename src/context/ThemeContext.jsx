import React, { useState, useEffect } from "react";
import { ThemeContext } from "./themeContextDefinition";

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(
    () => JSON.parse(localStorage.getItem("darkMode")) || false
  );

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(dark));
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark((prev) => !prev) }}>
      {children}
    </ThemeContext.Provider>
  );
};
