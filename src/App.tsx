import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
// @ts-ignore
import Particles from './components/Particles';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import ToolDetailPage from './pages/ToolDetailPage';
import ComparePage from './pages/ComparePage';
import CollectionsPage from './pages/CollectionsPage';
import SubmitToolPage from './pages/SubmitToolPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Lenis might be active, but window.scrollTo works universally. 
    // We can also use document.documentElement.scrollTo for safety.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/explore" element={<PageWrapper><ExplorePage /></PageWrapper>} />
        <Route path="/tool/:id" element={<PageWrapper><ToolDetailPage /></PageWrapper>} />
        <Route path="/compare" element={<PageWrapper><ComparePage /></PageWrapper>} />
        <Route path="/collections" element={<PageWrapper><CollectionsPage /></PageWrapper>} />
        <Route path="/submit" element={<PageWrapper><SubmitToolPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><AdminPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function MainLayout() {
  const { theme } = useTheme();

  return (
    <div className={`${theme} min-h-screen relative overflow-x-hidden isolate`}>
      {/* Fixed Particles background layer */}
      <div className="fixed inset-0 bg-background -z-30" />
      <div className="fixed inset-0 -z-20 pointer-events-none opacity-40">
        <Particles
          particleColors={["#D100D1", "#00F0FF", "#9526ff"]}
          particleCount={240}
          particleSpread={11}
          speed={0.08}
          particleBaseSize={110}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>
      
      <Navbar />
      <AppRoutes />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
