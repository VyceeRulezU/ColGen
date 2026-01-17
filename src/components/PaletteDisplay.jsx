import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { getContrastColor } from '../utils/colors';
import { colord } from 'colord';

const ColorChip = ({ shade, hex, name }) => {
    const isDark = colord(hex).isDark();
    const { addToast } = useToast();
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(hex);
        addToast(`Color ${hex} copied!`, "success");
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05, zIndex: 10 }}
            onClick={copyToClipboard}
            style={{
                backgroundColor: hex,
                padding: '1rem',
                borderRadius: '10px',
                height: '110px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                position: 'relative'
            }}
        >
            <span style={{ 
                fontSize: '0.85rem', 
                color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                fontWeight: 500 
            }}>
                {shade}
            </span>
            <span style={{ 
                fontSize: '1rem', 
                color: isDark ? '#fff' : '#000',
                fontWeight: 600,
                alignSelf: 'flex-end',
                opacity: 0,
                transition: 'opacity 0.2s'
            }} className="hex-val">
                {hex}
            </span>
            <style jsx>{`
                div:hover .hex-val { opacity: 1 !important; }
            `}</style>
        </motion.div>
    );
};

const PaletteRow = ({ category, shades }) => {
    const { categoryModes, toggleCategoryMode } = useTheme();
    const isDark = categoryModes[category] === 'dark';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="palette-row"
            style={{ marginBottom: '2rem' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '15px' }}>
                <h3 style={{ textTransform: 'capitalize', color: 'var(--text-primary)', margin: 0 }}>
                    {category}
                </h3>
                
                <button
                    onClick={() => toggleCategoryMode(category)}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        transition: 'all 0.2s'
                    }}
                >
                    {isDark ? <Moon size={14} /> : <Sun size={14} />}
                    {isDark ? 'Dark' : 'Light'}
                </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px' }}>
                {Object.entries(shades).map(([level, hex]) => (
                    <ColorChip key={level} shade={level} hex={hex} name={category} />
                ))}
            </div>
        </motion.div>
    );
};

const PaletteDisplay = () => {
    const { theme } = useTheme();

    if (!theme) return null;

    return (
        <div style={{ marginTop: '4rem' }}>
            {Object.entries(theme).map(([key, shades]) => {
                if (key === 'explanation') return null;
                // Correctly pass 'category' prop instead of 'title'
                return <PaletteRow key={key} category={key} shades={shades} />;
            })}
        </div>
    );
};

export default PaletteDisplay;
