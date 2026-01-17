import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot } from 'lucide-react';
import { useAI } from '../context/AIContext';
import { chatWithGemini } from '../services/gemini';

const ChatDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]); // Local UI state + Context history
    const [loading, setLoading] = useState(false);
    const { apiKey, chatHistory, addMessageToHistory } = useAI();
    const scrollRef = useRef(null);

    // Sync context history to local if needed, or just use local + context
    // For simplicity, we'll store display messages locally and sync meaningful ones to context
    
    const handleSend = async () => {
        if (!input.trim()) return;
        if (!apiKey) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Please set your API Key in settings first.' }]);
            return;
        }

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            // Context history + current sessions
            const response = await chatWithGemini(chatHistory, userMsg, apiKey);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
            addMessageToHistory('user', userMsg);
            addMessageToHistory('model', response);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to AI.' }]);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed', bottom: '2rem', right: '2rem',
                    width: '60px', height: '60px', borderRadius: '30px',
                    background: 'var(--text-primary)', color: 'var(--bg-color)',
                    border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    cursor: 'pointer', zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                <MessageSquare />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 45 }}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="glass-panel"
                            style={{
                                position: 'fixed', top: 0, right: 0, bottom: 0,
                                width: '100%', maxWidth: '400px', zIndex: 50,
                                display: 'flex', flexDirection: 'column'
                            }}
                        >
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0 }}>Design Assistant</h3>
                                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
                            </div>

                            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {messages.length === 0 && (
                                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
                                        <Bot size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                        <p>Ask me to adjust the colors, suggest fonts, or explain color theory!</p>
                                    </div>
                                )}
                                {messages.map((msg, idx) => (
                                    <div key={idx} style={{
                                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                        background: msg.role === 'user' ? 'var(--text-primary)' : 'rgba(255,255,255,0.1)',
                                        color: msg.role === 'user' ? 'var(--bg-color)' : 'white',
                                        padding: '10px 16px', borderRadius: '16px',
                                        maxWidth: '85%', fontSize: '0.95rem', lineHeight: '1.4',
                                        wordWrap: 'break-word', wordBreak: 'break-word'
                                    }}>
                                        {msg.content}
                                    </div>
                                ))}
                                {loading && <div style={{ alignSelf: 'flex-start', color: '#aaa', fontSize: '0.8rem' }}>AI is typing...</div>}
                            </div>

                            <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Type a message..."
                                        style={{
                                            flex: 1, padding: '12px', borderRadius: '99px',
                                            border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)',
                                            color: 'white', outline: 'none'
                                        }}
                                    />
                                    <button 
                                        onClick={handleSend}
                                        disabled={loading}
                                        style={{
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            border: 'none', background: 'var(--text-primary)', color: 'var(--bg-color)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                        }}
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatDrawer;
