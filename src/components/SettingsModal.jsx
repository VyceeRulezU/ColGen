import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useAI } from '../context/AIContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { apiKey, saveApiKey } = useAI();
  const [inputKey, setInputKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveApiKey(inputKey);
    setSaved(true);
    setTimeout(() => {
        setSaved(false);
        onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-panel"
            style={{ width: '400px', padding: '2rem', borderRadius: '24px', position: 'relative' }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X />
            </button>
            
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Settings</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Google Gemini API Key</label>
                <input 
                    type="password" 
                    value={inputKey} 
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="AIza..."
                    style={{
                        width: '100%', padding: '12px', borderRadius: '12px',
                        border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)',
                        color: 'white', fontSize: '1rem'
                    }}
                />
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                    Get a free key at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: '#0071e3' }}>Google AI Studio</a>
                </p>
            </div>

            <button 
                onClick={handleSave}
                style={{
                    width: '100%', padding: '12px', borderRadius: '12px',
                    border: 'none', background: saved ? '#10b981' : '#0071e3', color: 'white',
                    fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px'
                }}
            >
                {saved ? <>Saved <Check size={18}/></> : 'Save Configuration'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
