import { colord } from "colord";

// Simple keyword mapping for fallback generation
const KEYWORD_COLORS = {
    // Nature
    forest: "#228B22", green: "#10b981", leaf: "#4ade80", nature: "#166534",
    ocean: "#0ea5e9", blue: "#3b82f6", sea: "#0284c7", water: "#60a5fa",
    sky: "#0ea5e9", night: "#1e1b4b", midnight: "#0f172a", space: "#312e81",
    sun: "#f59e0b", sunset: "#f97316", fire: "#ef4444", heat: "#b91c1c",
    
    // Urban / Tech
    cyberpunk: "#d946ef", neon: "#f0abfc", city: "#64748b", concrete: "#94a3b8",
    tech: "#0071e3", modern: "#1d1d1f", minimal: "#f5f5f7", dark: "#18181b",
    
    // Emotions/Abstract
    love: "#ec4899", romantic: "#f43f5e", passion: "#be123c",
    calm: "#a5f3fc", soft: "#e2e8f0", pastel: "#f0f9ff",
    royal: "#7e22ce", gold: "#fbbf24", luxury: "#000000",
};

export const generateHeuristicTheme = (prompt) => {
    const lowerPrompt = prompt.toLowerCase();
    
    // 1. Find a primary color based on keywords
    let primaryHex = "#0071e3"; // Default blue
    let matched = false;

    // Check longer words first to match specificity? Simple iteration is fine for mvp.
    for (const [key, color] of Object.entries(KEYWORD_COLORS)) {
        if (lowerPrompt.includes(key)) {
            primaryHex = color;
            matched = true;
            break; 
        }
    }
    
    // If no match, maybe generate a deterministic random color from the string?
    if (!matched) {
        // Simple hash-to-color
        let hash = 0;
        for (let i = 0; i < prompt.length; i++) {
            hash = prompt.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        primaryHex = "#" + "00000".substring(0, 6 - c.length) + c;
    }

    // 2. Return a structure similar to what the API would return
    // The ThemeContext will take this and expand it into shades using generateThemeFromHex
    return {
        primary: primaryHex,
        secondary: colord(primaryHex).rotate(180).toHex(), // Complementary
        accent: colord(primaryHex).rotate(60).toHex(),     // Triadicish
        surface: "#ffffff",
        explanation: "Generated offline based on your keywords."
    };
};
