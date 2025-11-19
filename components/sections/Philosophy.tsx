import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const Philosophy: React.FC = () => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yLeft = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const yRight = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={containerRef} id="philosophy" className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Content */}
      <div className={`w-full md:w-1/2 px-8 md:px-16 py-32 flex items-center justify-center relative z-10
        ${theme === 'dark' ? 'bg-[#0F0F0F]' : 'bg-white'}`}>
        
        <motion.div style={{ y: yLeft }} className="max-w-xl">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={`block text-sm font-bold tracking-[0.2em] uppercase mb-8
            ${theme === 'dark' ? 'text-gold-light' : 'text-gold-dark'}`}
          >
            Our Approach
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-12 leading-[1.1]
            ${theme === 'dark' ? 'text-white' : 'text-black'}`}
          >
            We Build in Our Own Operations First.
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`space-y-10 text-xl leading-relaxed font-light
            ${theme === 'dark' ? 'text-secondary' : 'text-secondaryLight'}`}
          >
            <p>
              We don't just advise. We operate. Our systems are forged in the fires of our own commercial ventures before they ever touch a partner's infrastructure.
            </p>
            
            <div className="space-y-8">
              {[
                "Test in our operations first",
                "Deploy with enterprise partners",
                "Build proprietary solutions"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 group">
                  <div className={`h-px w-12 transition-all duration-500 group-hover:w-24
                    ${theme === 'dark' ? 'bg-gold-light' : 'bg-gold-dark'}`} />
                  <span className="text-lg font-medium tracking-wide">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Visual - Geometric Schematic */}
      <div className={`w-full md:w-1/2 relative overflow-hidden min-h-[500px] flex items-center justify-center
        ${theme === 'dark' ? 'bg-black' : 'bg-[#F5F5F5]'}`}>
        
        <motion.div style={{ y: yRight }} className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center">
            
            {/* Core Pulse */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute w-40 h-40 rounded-full blur-2xl
                ${theme === 'dark' ? 'bg-gold-light/30' : 'bg-gold-dark/20'}`}
            />

            {/* Center Solid Circle */}
            <div className={`absolute w-2 h-2 rounded-full z-20
                ${theme === 'dark' ? 'bg-gold-light' : 'bg-gold-dark'}`} 
            />

            {/* Geometric Rings */}
            {[1, 2, 3].map((ring, i) => (
               <motion.div
                key={i}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 20 + (i * 10), repeat: Infinity, ease: "linear" }}
                className={`absolute rounded-full border-[1px] z-10 flex items-center justify-center
                ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}
                style={{ 
                  width: `${(i + 1) * 30}%`, 
                  height: `${(i + 1) * 30}%` 
                }}
            >
                 {/* Orbital Node on Ring */}
                <div className={`absolute top-0 w-2 h-2 rounded-full -translate-y-1/2
                    ${theme === 'dark' ? 'bg-gold-light' : 'bg-gold-dark'}`} 
                />
            </motion.div>
            ))}
            
            {/* Outer Dashed Ring */}
             <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className={`absolute w-[90%] h-[90%] rounded-full border-[1px] border-dashed z-10
                ${theme === 'dark' ? 'border-white/20' : 'border-black/20'}`}
            />

            {/* Grid Lines */}
            <div className={`absolute inset-0 w-full h-full opacity-10
               ${theme === 'dark' 
                 ? 'bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]' 
                 : 'bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]'}`} 
            />

        </motion.div>
      </div>
    </section>
  );
};

export default Philosophy;