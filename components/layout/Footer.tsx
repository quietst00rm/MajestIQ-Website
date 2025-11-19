import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Logo } from '../ui/Logo';

const Footer: React.FC = () => {
  const { theme } = useTheme();

  const footerLinks = [
    { label: 'Approach', href: '#approach' },
    { label: 'Philosophy', href: '#philosophy' },
    { label: 'Connect', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      // Calculate offset to account for fixed header (h-24 is approx 96px)
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`py-12 px-6 border-t transition-colors duration-500
      ${theme === 'dark' ? 'bg-[#050505] border-white/10' : 'bg-gray-100 border-black/5'}`}>
      <div className="container mx-auto flex flex-col items-center text-center">
        <a 
          href="#" 
          onClick={handleScrollToTop}
          className="mb-12 cursor-hover inline-block"
          aria-label="Scroll to top"
        >
          <Logo className="scale-125" />
        </a>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`text-base uppercase tracking-[0.2em] font-semibold transition-all duration-300 cursor-hover relative group
                ${theme === 'dark' ? 'text-secondary hover:text-white' : 'text-secondaryLight hover:text-black'}`}
            >
              {link.label}
              <span className={`absolute -bottom-2 left-0 w-0 h-0.5 bg-gold-light transition-all duration-300 group-hover:w-full`} />
            </a>
          ))}
        </div>

        <p className={`text-xs tracking-[0.1em]
          ${theme === 'dark' ? 'text-white/50' : 'text-black/50'}`}>
          © {new Date().getFullYear()} MAJESTIQ. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};

export default Footer;