import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Code, Image as ImageIcon, FileJson } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import html2canvas from 'html2canvas';

const ExportMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme } = useTheme();
    const { addToast } = useToast();

    const handleCopyCSS = () => {
        if (!theme) return;
        let css = ":root {\n";
        Object.entries(theme).forEach(([category, shades]) => {
            if (category === 'explanation') return;
            Object.entries(shades).forEach(([level, hex]) => {
                css += `  --${category}-${level}: ${hex};\n`;
            });
        });
        css += "}";
        navigator.clipboard.writeText(css);
        addToast("CSS Variables copied to clipboard!", "success");
        setIsOpen(false);
    };

    const handleCopyJSON = () => {
         if (!theme) return;
         navigator.clipboard.writeText(JSON.stringify(theme, null, 2));
         addToast("JSON Tokens copied to clipboard!", "success");
         setIsOpen(false);
    };
    
    // Placeholder for image export logic (needs DOM ref, usually handled by passing ref or selecting by ID)
    const handleSaveImage = async () => {
        const element = document.body; // Capture full app or specific container
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = data;
        link.download = 'theme-export.png';
        link.click();
        setIsOpen(false);
    };

    return (
        <div style={{ position: 'relative' }}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)',
                    color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px'
                }}
            >
                <Download size={16} /> Export
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="glass-panel"
                        style={{
                            position: 'absolute', top: '120%', right: 0,
                            width: '200px', borderRadius: '12px', padding: '8px',
                            display: 'flex', flexDirection: 'column', gap: '4px'
                        }}
                    >
                        <MenuItem icon={<ImageIcon size={16} />} label="Save Image" onClick={handleSaveImage} />
                        <MenuItem icon={<Code size={16} />} label="Copy CSS" onClick={handleCopyCSS} />
                        <MenuItem icon={<FileJson size={16} />} label="Copy JSON" onClick={handleCopyJSON} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const MenuItem = ({ icon, label, onClick }) => (
    <button 
        onClick={onClick}
        style={{
            background: 'transparent', border: 'none', color: 'white',
            padding: '10px', display: 'flex', alignItems: 'center', gap: '10px',
            width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '8px',
            transition: 'background 0.2s', fontSize: '0.9rem'
        }}
        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
        onMouseLeave={(e) => e.target.style.background = 'transparent'}
    >
        {icon} {label}
    </button>
);

export default ExportMenu;
