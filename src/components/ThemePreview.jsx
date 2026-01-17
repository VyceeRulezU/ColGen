import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemePreview = () => {
    const { theme } = useTheme();
    if (!theme) return null;

    const PrimaryButton = ({ children }) => (
        <button style={{
            background: theme.primary[500],
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer'
        }}>
            {children}
        </button>
    );

    const SecondaryButton = ({ children }) => (
        <button style={{
            background: 'transparent',
            color: theme.primary[500],
            border: `2px solid ${theme.primary[500]}`,
            padding: '10px 22px',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer'
        }}>
            {children}
        </button>
    );

    const Card = ({ title, body }) => (
        <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: `0 4px 20px -5px ${theme.neutral[900]}20`, // Using neutral with opacity
            color: theme.neutral[900]
        }}>
            <h4 style={{ color: theme.primary[700], marginBottom: '8px' }}>{title}</h4>
            <p style={{ color: theme.neutral[600], lineHeight: 1.5 }}>{body}</p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
             <span style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px', background: theme.primary[100], color: theme.primary[800] }}>Tag 1</span>
             <span style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px', background: theme.accent[100], color: theme.accent[800] }}>Tag 2</span>
            </div>
        </div>
    );

    return (
        <div style={{ marginTop: '2rem', display: 'grid', gap: '2rem' }}>
            <h3 style={{textAlign: 'center', marginBottom: '1rem'}}>Design System Preview</h3>
            
            {/* Buttons Section */}
            <section style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <PrimaryButton>Primary Action</PrimaryButton>
                <SecondaryButton>Secondary Action</SecondaryButton>
                <button style={{
                    background: theme.error[500], color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 600
                }}>Destructive</button>
                <button style={{
                    background: theme.success[500], color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 600
                }}>Confirm</button>
            </section>

            {/* Cards Section */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <Card 
                    title="Card Title" 
                    body="This is a preview of how surface colors, typography, and primary accents interact in a card component." 
                />
                 <div style={{
                    background: theme.neutral[900],
                    padding: '24px',
                    borderRadius: '16px',
                    color: 'white'
                }}>
                    <h4 style={{ color: theme.primary[300], marginBottom: '8px' }}>Dark Surface</h4>
                    <p style={{ color: theme.neutral[300], lineHeight: 1.5 }}>Testing dark mode contrast and text legibility on inverted surfaces.</p>
                     <div style={{ marginTop: '16px' }}>
                        <PrimaryButton>Action</PrimaryButton>
                    </div>
                </div>
            </section>
            
            {/* Alerts */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '16px', borderRadius: '8px', background: theme.warning[100], color: theme.warning[900], borderLeft: `4px solid ${theme.warning[500]}`}}>
                    <strong>Warning</strong>: This is a warning alert state.
                </div>
                 <div style={{ padding: '16px', borderRadius: '8px', background: theme.success[100], color: theme.success[900], borderLeft: `4px solid ${theme.success[500]}`}}>
                    <strong>Success</strong>: The operation completed successfully.
                </div>
             </div>
        </div>
    );
};

export default ThemePreview;
