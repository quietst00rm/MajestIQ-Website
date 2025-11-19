import React, { useEffect, useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import Capabilities from './components/sections/Capabilities';
import Philosophy from './components/sections/Philosophy';
import Approach from './components/sections/Approach';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={`fixed inset-0 z-[100] flex items-center justify-center
        ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
    >
      <div className="relative flex flex-col items-center gap-8">
         <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`text-2xl font-heading font-bold tracking-[0.3em] ${theme === 'dark' ? 'text-white' : 'text-black'}`}
        >
          MAJEST<span className="text-gold-light">IQ</span>
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className={`w-12 h-12 rounded-full border-t-2 border-b-2 border-transparent
            ${theme === 'dark' ? 'border-t-gold-light border-b-gold-light' : 'border-t-gold-dark border-b-gold-dark'}`}
        />
      </div>
    </motion.div>
  );
};

const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gold-light origin-left z-[60]"
      style={{ scaleX }}
    />
  );
};

const AppContent: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prevent browser from restoring scroll position on refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Force scroll to top immediately
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>

      <ScrollProgress />
      
      <main className="relative z-10">
        <Navbar />
        <Hero />
        <Capabilities />
        <Philosophy />
        <Approach />
        <Contact />
        <Footer />
      </main>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;