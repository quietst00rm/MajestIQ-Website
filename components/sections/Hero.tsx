import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Background3D from '../visuals/Background3D';

const Hero: React.FC = () => {
  const { theme } = useTheme();
  const { scrollY } = useScroll();
  
  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const yBg = useTransform(scrollY, [0, 500], [0, 50]); // Background moves slower (parallax)
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const scrollToNext = () => {
    const nextSection = document.getElementById('capabilities');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } 
    },
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-6 pt-32 pb-16">
      {/* Hero Background with Parallax Container */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 w-full h-full">
        <Background3D />
      </motion.div>

      <motion.div 
        className="container mx-auto relative z-10 text-center"
        style={{ y: yText, opacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-sm font-medium tracking-[3px] uppercase mb-6 text-gold-light"
        >
          For Brands Operating at Scale
        </motion.h2>

        <motion.h1 
          variants={itemVariants}
          className={`text-5xl md:text-7xl lg:text-9xl font-heading font-bold mb-8 leading-[1.15] tracking-tight
            ${theme === 'dark' ? 'text-white' : 'text-black'}`}
        >
          Building Tomorrow's<br />
          <span className="text-gold-light bg-clip-text text-transparent bg-gradient-to-r from-gold-light to-gold-muted">
            Operational Systems
          </span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className={`text-xl md:text-2xl max-w-[600px] mx-auto leading-relaxed mb-12 font-light
            ${theme === 'dark' ? 'text-[#D1D1D1]' : 'text-secondaryLight'}`}
        >
          Proprietary solutions for enterprise operations that standard software cannot solve.
        </motion.p>

        <motion.button 
          variants={itemVariants}
          onClick={scrollToNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-3 text-sm uppercase tracking-widest font-bold transition-all duration-300 cursor-hover text-gold-light mx-auto"
        >
          Explore
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-gold-light/30 group-hover:border-gold-light transition-colors">
             <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <ArrowDown size={14} />
            </motion.div>
          </span>
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;