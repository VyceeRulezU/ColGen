import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { calculateShades, generateThemeFromHex } from '../utils/colors';

const ColorInput = ({ label, value, onChange }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{label}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
                type="color" 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: '40px', height: '40px', padding: 0, border: 'none',
                    borderRadius: '8px', cursor: 'pointer', background: 'none'
                }} 
            />
            <input 
                type="text" 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                style={{
                    padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)',
                    background: 'rgba(0,0,0,0.2)', color: 'white', fontFamily: 'monospace'
                }}
            />
        </div>
    </div>
);

const ManualInput = () => {
    const { theme, setTheme } = useTheme();
    // Initialize local state with current theme primaries if available, else defaults
    const [colors, setColors] = useState({
        primary: theme?.primary?.[500] || '#0071e3',
        secondary: theme?.secondary?.[500] || '#5e5ce6',
        accent: theme?.accent?.[500] || '#ff2d55',
        success: theme?.success?.[500] || '#34c759',
        warning: theme?.warning?.[500] || '#ff9500',
        error: theme?.error?.[500] || '#ff3b30',
        neutral: theme?.neutral?.[500] || '#8e8e93',
    });

    const handleColorChange = (key, hex) => {
        setColors(prev => ({ ...prev, [key]: hex }));
    };

    const handleGenerate = () => {
        const newTheme = {};
        Object.entries(colors).forEach(([key, hex]) => {
            newTheme[key] = calculateShades(hex);
        });
        setTheme(newTheme);
    };

    return (
        <section className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', maxWidth: '800px', margin: '2rem auto' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Manual Configuration</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {Object.keys(colors).map(key => (
                    <ColorInput 
                        key={key} 
                        label={key.charAt(0).toUpperCase() + key.slice(1)} 
                        value={colors[key]} 
                        onChange={(hex) => handleColorChange(key, hex)}
                    />
                ))}
            </div>
            <button 
                onClick={handleGenerate}
                style={{
                    marginTop: '2rem', width: '100%', padding: '16px',
                    borderRadius: '12px', background: 'var(--text-primary)', color: 'var(--bg-color)',
                    border: 'none', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer'
                }}
            >
                Generate Palette from Selection
            </button>
            
             <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Palette Mode:</span>
                <button 
                     onClick={useTheme().togglePaletteMode}
                     style={{
                         background: useTheme().isDarkMode ? 'white' : 'transparent',
                         color: useTheme().isDarkMode ? 'black' : 'white',
                         border: '1px solid var(--glass-border)',
                         padding: '8px 16px',
                         borderRadius: '99px',
                         cursor: 'pointer',
                         fontWeight: 500,
                         transition: 'all 0.3s'
                     }}
                >
                    {useTheme().isDarkMode ? 'Dark Interface' : 'Light Interface'}
                </button>
            </div>
        </section>
    );
};

export default ManualInput;
