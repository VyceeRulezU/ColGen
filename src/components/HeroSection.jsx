import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAI } from '../context/AIContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { generateThemeFromPrompt } from '../services/gemini';

const HeroSection = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const { apiKey } = useAI();
    const { updateTheme } = useTheme();
    const { addToast } = useToast();

    const handleGenerate = async () => {
        if (!prompt) return;
        if (!prompt) return;
        // Proceed even without API key (Offline Mode)

        setLoading(true);
        try {
            const themeData = await generateThemeFromPrompt(prompt, apiKey);
            console.log("Generated:", themeData);
            updateTheme(themeData); 
            if (themeData.explanation === "Generated offline based on your keywords.") {
                addToast("Offline Mode: Theme generated from keywords.", "info");
            } else {
                addToast("Theme generated successfully!", "success");
            }
        } catch (err) {
            console.error(err);
            addToast(err.message || "Failed to generate theme.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="glass-panel" style={{ 
            marginTop: '2rem', padding: '2rem', borderRadius: '24px', 
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
            maxWidth: '800px', margin: '0 auto' 
        }}>
            <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Describe your dream theme</p>
                <p style={{ color: 'var(--text-secondary)' }}>e.g., "Cyberpunk neon city at midnight," "Soft pastel bakery," "Deep forest moss"</p>
            </div>

            <div style={{ width: '100%', position: 'relative' }}>
                <textarea
                    placeholder="What are you envisioning?"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '1.5rem',
                        paddingRight: '4rem',
                        borderRadius: '16px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--glass-border)',
                        color: 'white',
                        fontSize: '1rem',
                        resize: 'none',
                        outline: 'none',
                        fontFamily: 'inherit'
                    }}
                />
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '1rem',
                        background: 'var(--text-primary)',
                        color: 'var(--bg-color)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.8rem 1.2rem',
                        cursor: loading ? 'wait' : 'pointer',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        opacity: loading ? 0.7 : 1,
                        transition: 'transform 0.2s'
                    }}
                >
                    {loading ? 'Thinking...' : <><span className="desktop-only-text" style={{ marginRight: '8px' }}>Generate</span><Sparkles size={18} /></>}
                </button>
            </div>
            
            {/* Dark Mode Palette Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

export default HeroSection;
