import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";

extend([mixPlugin]);

export const calculateShades = (hexColor) => {
  const base = colord(hexColor);
  const shades = {};
  
  // Custom scale: 25, 50, 100... 975
  const levels = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 975];

  levels.forEach((level) => {
    if (level === 500) {
      shades[level] = base.toHex();
    } else if (level < 500) {
      const ratio = (500 - level) / 500; 
      shades[level] = base.mix("#ffffff", ratio * 0.95).toHex(); 
    } else {
      const ratio = (level - 500) / 500;
      shades[level] = base.mix("#000000", ratio * 0.9).toHex();
    }
  });

  return shades;
};

export const generateThemeFromHex = (primaryHex) => {
  let primary = colord(primaryHex);

  const secondary = primary.rotate(180).toHex(); 
  const accent = primary.rotate(60).toHex();
  const success = "#10b981";
  const warning = "#f59e0b";
  const error = "#ef4444";
  
  return {
    primary: calculateShades(primaryHex),
    secondary: calculateShades(secondary),
    accent: calculateShades(accent),
    success: calculateShades(success),
    warning: calculateShades(warning),
    error: calculateShades(error),
    neutral: calculateShades("#808080"),
  };
};

export const createDarkVariant = (themeShades) => {
    // Generates a DARK MODE version of the palette
    // Strategy: Take the '200' shade (Light) and make it the new '500' (Base)
    const newTheme = {};
    Object.keys(themeShades).forEach(key => {
        if(key === 'explanation') {
            newTheme[key] = themeShades[key];
            return;
        }
        
        // Safety check if shades exist
        if (themeShades[key] && themeShades[key][200]) {
             const lightMode200 = themeShades[key][200]; 
             newTheme[key] = calculateShades(lightMode200); 
        } else {
             newTheme[key] = themeShades[key];
        }
    });
    return newTheme;
};

export const getContrastColor = (hex) => {
  return colord(hex).isDark() ? "#ffffff" : "#000000";
};
