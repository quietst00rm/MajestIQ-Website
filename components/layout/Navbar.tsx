import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Logo } from '../ui/Logo';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Approach', href: '#approach' },
    { label: 'Philosophy', href: '#philosophy' },
    { label: 'Connect', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 h-24 flex items-center
          ${scrolled 
            ? (theme === 'dark' ? 'bg-black/80 backdrop-blur-lg shadow-xl shadow-black/40 border-b border-white/5' : 'bg-white/90 backdrop-blur-lg shadow-xl shadow-gray-200/50') 
            : 'bg-transparent'}`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="cursor-hover relative z-50">
            <Logo className="scale-110" />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`text-sm uppercase tracking-[0.2em] font-semibold transition-colors duration-300 relative group cursor-hover
                  ${theme === 'dark' ? 'text-white hover:text-gold-light' : 'text-black hover:text-gold-dark'}`}
              >
                {link.label}
                <span className={`absolute -bottom-2 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full`} />
              </button>
            ))}
            
            <div className="w-px h-8 bg-current opacity-20" />

            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 cursor-hover border
                ${theme === 'dark' 
                  ? 'bg-white/5 text-gold-light border-white/10 hover:bg-white/10' 
                  : 'bg-black/5 text-gold-dark border-black/5 hover:bg-black/10'}`}
              aria-label="Toggle Theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </nav>

          {/* Mobile Toggle & Menu */}
          <div className="flex items-center gap-4 md:hidden relative z-50">
             <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors duration-300
                ${theme === 'dark' ? 'text-gold-light' : 'text-gold-dark'}`}
            >
              {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
            >
              {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-40 flex flex-col justify-center items-center
              ${theme === 'dark' ? 'bg-charcoal/95 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl'}`}
          >
            <div className="flex flex-col gap-10 text-center">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-4xl font-heading font-bold tracking-wide transition-colors
                    ${theme === 'dark' ? 'text-white hover:text-gold-light' : 'text-black hover:text-gold-dark'}`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;