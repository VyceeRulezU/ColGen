import React from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AIProvider } from './context/AIContext';
import HeroSection from './components/HeroSection';
import PaletteDisplay from './components/PaletteDisplay';
import SettingsModal from './components/SettingsModal';
import ExportMenu from './components/ExportMenu';
import ChatDrawer from './components/ChatDrawer';
import ManualInput from './components/ManualInput';
import ThemePreview from './components/ThemePreview';
import { Sun, Moon } from 'lucide-react';
import { ToastProvider } from './context/ToastContext';
import './styles/global.css';

// Placeholder Components
const Layout = ({ children }) => {
  const { backgroundUrl } = useTheme();
  return (
    <>
      <div className="futuristic-bg" style={{ backgroundImage: `url(${backgroundUrl})` }}>
        <div className="overlay"></div>
      </div>
      <div className="app-content" style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        {children}
      </div>
    </>
  );
};

const Header = ({ onOpenSettings }) => {
    return (
        <header className="glass-panel" style={{ 
            padding: '1rem 2rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderRadius: '0 0 20px 20px', 
            margin: '0 1rem',
            position: 'sticky',
            top: 0,
            zIndex: 40 
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img 
                    src="/logo.png" 
                    alt="ColorGenius Logo" 
                    style={{ 
                        height: '40px', 
                        width: 'auto',
                        objectFit: 'contain' 
                    }} 
                />
            </div>
            <div className="actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ExportMenu />
                <button onClick={onOpenSettings} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>Settings</button>
            </div>
        </header>
    );
};

const AppContent = () => {
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('generate'); // 'generate' | 'manual' | 'preview'

    const TabButton = ({ id, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            style={{
                background: activeTab === id ? 'var(--text-primary)' : 'transparent',
                color: activeTab === id ? 'var(--bg-color)' : 'var(--text-secondary)',
                border: '1px solid var(--glass-border)',
                padding: '10px 24px',
                borderRadius: '99px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.3s'
            }}
        >
            {label}
        </button>
    );

    return (
        <Layout>
            <Header onOpenSettings={() => setSettingsOpen(true)} />
            <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
            
            <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}>
                <h2 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', background: 'linear-gradient(to right, #fff, #999)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Generate your next<br/>masterpiece.
                </h2>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                    <TabButton id="generate" label="AI Generator" />
                    <TabButton id="manual" label="Manual Input" />
                    <TabButton id="preview" label="Design System" />
                </div>

                <div style={{ minHeight: '400px' }}>
                    {activeTab === 'generate' && <HeroSection />}
                    {activeTab === 'manual' && <ManualInput />}
                    {activeTab === 'preview' && <ThemePreview />}
                    
                    {/* Always show palette below generation/manual, but maybe hide for preview if it gets too long? 
                        Let's keep it for now unless on preview tab where it might be redundant. 
                        Actually, user wants to see the colors. 
                    */}
                    {activeTab !== 'preview' && <PaletteDisplay />}
                </div>
            </main>
            <ChatDrawer />
        </Layout>
    )
}

function App() {
  return (
    <ToastProvider>
      <AIProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AIProvider>
    </ToastProvider>
  );
}

export default App;
