import React, { createContext, useContext, useState, useEffect } from "react";
import { generateThemeFromHex, createDarkVariant, calculateShades } from "../utils/colors";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  
  // Store the "Light" (original) version of the current theme separately
  // so we can always revert back or generate dark variants from the true source.
  const [originalTheme, setOriginalTheme] = useState(null); 
  
  // Track mode for each category: { primary: 'light', secondary: 'dark', ... }
  const [categoryModes, setCategoryModes] = useState({}); 

  const [backgroundUrl, setBackgroundUrl] = useState("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop");

  useEffect(() => {
    // Initial Theme
    const initialTheme = generateThemeFromHex("#0071e3");
    setTheme(initialTheme);
    setOriginalTheme(initialTheme);
    initializeModes(initialTheme);
  }, []);

  const initializeModes = (themeData) => {
      const modes = {};
      Object.keys(themeData).forEach(key => {
          modes[key] = 'light';
      });
      setCategoryModes(modes);
  };

  const updateTheme = (newThemeData) => {
      let generated = newThemeData;
      
      // Handle case where we just get base colors and need to generate shades
      if (newThemeData.primary && typeof newThemeData.primary === 'string') {
           generated = generateThemeFromHex(newThemeData.primary);
           // Note: if newThemeData has other bases (secondary, etc.), we should ideally use them.
           // For now, generateThemeFromHex generates a full scheme from one color. 
           // If we wanted to respect individual bases:
           // generated = { ...generateThemeFromHex(newThemeData.primary), ...customShades... }
      }

      setTheme(generated);
      setOriginalTheme(generated);
      initializeModes(generated);
  };

  const toggleCategoryMode = (category) => {
      setCategoryModes(prev => {
          const newMode = prev[category] === 'light' ? 'dark' : 'light';
          
          // Calculate the new shades for this category
          const newTheme = { ...theme };
          
          if (newMode === 'dark') {
              // Generate dark variant from the ORIGINAL light source
              // Logic: Take original[category][200] and make it the base for dark mode
              const lightBase = originalTheme[category][200];
              newTheme[category] = calculateShades(lightBase);
          } else {
              // Revert to original
              newTheme[category] = originalTheme[category];
          }
          
          setTheme(newTheme);
          return { ...prev, [category]: newMode };
      });
  };

  // Deprecated: Global toggle (kept for backward compat if needed, but mapped to all)
  const togglePaletteMode = () => {
      const allDark = Object.values(categoryModes).every(m => m === 'dark');
      const newMode = allDark ? 'light' : 'dark';
      
      const newModes = {};
      const newTheme = { ...theme };

      Object.keys(theme).forEach(key => {
          if (key === 'explanation') return;
          newModes[key] = newMode;
           if (newMode === 'dark') {
              const lightBase = originalTheme[key][200];
              newTheme[key] = calculateShades(lightBase);
          } else {
              newTheme[key] = originalTheme[key];
          }
      });
      
      setCategoryModes(newModes);
      setTheme(newTheme);
  };

  const isDarkMode = Object.values(categoryModes).some(m => m === 'dark');

  return (
    <ThemeContext.Provider value={{ 
        theme, 
        setTheme, 
        updateTheme, 
        categoryModes, 
        toggleCategoryMode,
        togglePaletteMode, // Global switch
        isDarkMode,
        backgroundUrl, 
        setBackgroundUrl 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
