import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <span className={`font-heading font-bold text-2xl tracking-wide ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        Majest<span className={theme === 'dark' ? 'text-gold-light' : 'text-gold-dark'}>IQ</span>
      </span>
    </div>
  );
};