import Header from './components/Header';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import BrokerLogs from './pages/BrokerLogs';
import Devices from './pages/Devices';
import Dashboard from './pages/Dashboard';
import Certificates from './pages/Certificates';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

function AppContent() {
  const { scrollY } = useScroll();
  const { theme } = usePlatform();
  const [headerState, setHeaderState] = useState<'hidden' | 'visible' | 'closing'>('visible');

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => {
        if (y > 50) {
            if (headerState !== 'visible') setHeaderState('visible');
        }
    });
    return () => unsubscribe();
  }, [headerState, scrollY]);

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/broker-logs" element={<BrokerLogs />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/certificates" element={<Certificates />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <PlatformProvider>
      <AppContent />
    </PlatformProvider>
  );
}

export default App;
