import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div style={{
                position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none'
            }}>
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{
                                background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '99px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                pointerEvents: 'auto',
                                minWidth: '300px',
                                justifyContent: 'center'
                            }}
                        >
                            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                            <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{toast.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
