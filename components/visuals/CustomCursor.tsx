import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const CustomCursor: React.FC = () => {
  const { theme } = useTheme();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 8); // Center the 16px cursor (visual size)
      mouseY.set(e.clientY - 8);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.closest('a, button, input, textarea, .cursor-hover');
      setIsHovering(!!isClickable);
    };

    const handleMouseOut = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [mouseX, mouseY, isVisible]);

  // Only show on desktop
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches) {
    return null;
  }

  return (
    <motion.div
      ref={cursorRef}
      style={{
        x: cursorX,
        y: cursorY,
        opacity: isVisible ? 1 : 0,
      }}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
    >
      <motion.div 
        className={`rounded-full ${theme === 'dark' ? 'bg-gold-light' : 'bg-gold-dark'}`}
        animate={{
          width: isHovering ? 48 : 12,
          height: isHovering ? 48 : 12,
          x: isHovering ? -18 : 0, // Adjust center when scaling
          y: isHovering ? -18 : 0,
          opacity: isHovering ? 0.4 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          filter: 'blur(0.5px)'
        }}
      />
      {!isHovering && (
         <motion.div 
          className={`absolute top-0 left-0 w-3 h-3 rounded-full ${theme === 'dark' ? 'shadow-[0_0_10px_2px_rgba(255,215,0,0.5)]' : 'shadow-[0_0_10px_2px_rgba(180,151,14,0.5)]'}`}
         />
      )}
    </motion.div>
  );
};

export default CustomCursor;