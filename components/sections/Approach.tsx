
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const steps = [
  {
    id: '01',
    title: 'Discovery',
    text: 'We begin by deconstructing your operational bottlenecks. No assumptions, just data-driven analysis of where scale breaks down.'
  },
  {
    id: '02',
    title: 'Architecture',
    text: 'Designing proprietary systems that integrate with your existing stack while introducing autonomous capabilities unavailable in standard software.'
  },
  {
    id: '03',
    title: 'Deployment',
    text: 'Phased integration. We validate in isolated environments before broad rollout, ensuring stability is never compromised for speed.'
  },
  {
    id: '04',
    title: 'Scale',
    text: 'The system learns. As volume increases, our architecture optimizes itself, turning operational cost centers into efficiency engines.'
  }
];

const Approach: React.FC = () => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useRef(0);
  const isScrollingToCard = useRef(false);

  // Touch state for swipe detection
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const swipeStartIndex = useRef<number>(0);

  // Track active index
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Only update index if not actively being animated to a specific card via click
      // This prevents flickering during smooth scrolls
      const scrollLeft = container.scrollLeft;
      
      // Calculate index based on rough visual position
      const index = Math.round(scrollLeft / (container.scrollWidth / steps.length));
      setActiveIndex(Math.min(Math.max(index, 0), steps.length - 1));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll on hover logic (Desktop only)
  useEffect(() => {
    let rafId: number;
    
    const updateScroll = () => {
      // Don't auto-scroll if user just clicked a card (let the smooth scroll finish)
      if (isHovering && containerRef.current && !isScrollingToCard.current) {
        const container = containerRef.current;
        const { left, width } = container.getBoundingClientRect();
        const relativeX = mouseX.current - left;
        
        // Define active zones (150px from edges)
        const zoneSize = 200; 
        
        if (relativeX < zoneSize) {
          // Left Zone
          const speed = 5 * (1 - relativeX / zoneSize);
          container.scrollLeft -= Math.max(1, speed);
        } else if (relativeX > width - zoneSize) {
          // Right Zone
          const dist = width - relativeX;
          const speed = 5 * (1 - dist / zoneSize);
          container.scrollLeft += Math.max(1, speed);
        }
      }
      rafId = requestAnimationFrame(updateScroll);
    };

    // Start loop
    updateScroll();
    
    return () => cancelAnimationFrame(rafId);
  }, [isHovering]);

  const handleCardClick = (index: number) => {
    if (containerRef.current && containerRef.current.children[index]) {
      isScrollingToCard.current = true;
      
      containerRef.current.children[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      
      // Re-enable auto-scroll after animation typically finishes
      setTimeout(() => {
        isScrollingToCard.current = false;
      }, 800);
    }
  };

  const handleCardInteraction = (index: number) => {
    if (index === activeIndex) {
      // If tapping the active card, move to next if available
      if (index < steps.length - 1) {
        handleCardClick(index + 1);
      }
    } else {
      // If tapping a side card, center it
      handleCardClick(index);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null; // Reset end position
    swipeStartIndex.current = activeIndex; // Capture where we started
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    // Left Swipe (Finger moves Right -> Left) => Next Slide
    if (distance > minSwipeDistance) {
      const nextIndex = swipeStartIndex.current + 1;
      if (nextIndex < steps.length) {
        handleCardClick(nextIndex);
      }
    }
    // Right Swipe (Finger moves Left -> Right) => Prev Slide
    else if (distance < -minSwipeDistance) {
      const prevIndex = swipeStartIndex.current - 1;
      if (prevIndex >= 0) {
        handleCardClick(prevIndex);
      }
    }
    
    // Reset
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleNext = () => {
    if (activeIndex < steps.length - 1) {
      handleCardClick(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      handleCardClick(activeIndex - 1);
    }
  };

  return (
    <section id="approach" className={`py-32 md:py-40 relative overflow-hidden
      ${theme === 'dark' ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
      
      <div className="container mx-auto px-6 mb-20">
         <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`text-4xl md:text-5xl font-heading font-bold
            ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            The Process
          </motion.h2>
      </div>

      <div 
        ref={containerRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={(e) => mouseX.current = e.clientX}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex overflow-x-auto snap-x snap-mandatory md:snap-none no-scrollbar pb-12 px-6 md:px-[12.5vw] gap-8 md:gap-12"
      >
        {steps.map((step, i) => (
          <div 
            key={step.id}
            onClick={() => handleCardInteraction(i)}
            className="snap-center shrink-0 w-[85vw] md:w-[60vw] lg:w-[50vw] cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: "-20%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`h-full p-10 md:p-16 rounded-3xl border flex flex-col relative overflow-hidden group transition-all duration-300
                ${theme === 'dark' 
                  ? 'bg-[#141414] border-white/5 hover:border-gold-light/30' 
                  : 'bg-[#FAFAFA] border-black/5 hover:border-gold-dark/30 shadow-2xl shadow-black/5'}`}
            >
              {/* Active Accent Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-2 transition-opacity duration-300
                ${activeIndex === i ? 'opacity-100' : 'opacity-0'}
                ${theme === 'dark' ? 'bg-gold-light' : 'bg-gold-dark'}`} 
              />

              <div className="mb-12">
                <span className={`text-6xl md:text-8xl font-bold tracking-tighter opacity-100 block mb-6 font-heading
                  ${theme === 'dark' ? 'text-gold-light' : 'text-gold-dark'}`}>
                  {step.id}
                </span>
                <h3 className={`text-3xl md:text-5xl font-heading font-bold
                  ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {step.title}
                </h3>
              </div>

              <p className={`text-xl leading-relaxed max-w-xl
                ${theme === 'dark' ? 'text-secondary' : 'text-secondaryLight'}`}>
                {step.text}
              </p>
              
              {/* Hover helper text for desktop */}
              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                <span className={`text-sm uppercase tracking-widest font-bold ${theme === 'dark' ? 'text-gold-light' : 'text-gold-dark'}`}>
                  {activeIndex === i && i < steps.length - 1 ? 'Next Step' : 'Focus'}
                </span>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Navigation Controls (Replaces Dots) */}
      <div className="flex items-center justify-center gap-8 mt-8 max-w-xs mx-auto px-6">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className={`p-4 rounded-full border transition-all duration-300 active:scale-95 ${
            activeIndex === 0
              ? 'opacity-30 cursor-not-allowed border-transparent'
              : theme === 'dark'
                ? 'border-white/10 hover:bg-white/10 text-white bg-white/5'
                : 'border-black/10 hover:bg-black/5 text-black bg-black/5'
          }`}
          aria-label="Previous Step"
        >
          <ChevronLeft size={24} />
        </button>

        <span className={`font-mono text-lg tracking-widest font-bold tabular-nums
          ${theme === 'dark' ? 'text-gold-light' : 'text-gold-dark'}`}>
          0{activeIndex + 1} <span className={`opacity-30 text-sm mx-1 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>/</span> 0{steps.length}
        </span>

        <button
          onClick={handleNext}
          disabled={activeIndex === steps.length - 1}
          className={`p-4 rounded-full border transition-all duration-300 active:scale-95 ${
            activeIndex === steps.length - 1
              ? 'opacity-30 cursor-not-allowed border-transparent'
              : theme === 'dark'
                ? 'border-white/10 hover:bg-white/10 text-white bg-white/5'
                : 'border-black/10 hover:bg-black/5 text-black bg-black/5'
          }`}
          aria-label="Next Step"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default Approach;
