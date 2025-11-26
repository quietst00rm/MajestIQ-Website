import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { ArrowRight, CornerDownLeft, Check, AlertCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const { theme } = useTheme();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState(false);
  
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const steps = [
    { key: 'name', label: 'Name', placeholder: 'Identify yourself', type: 'text' },
    { key: 'email', label: 'Email', placeholder: 'Digital coordinates', type: 'email' },
    { key: 'company', label: 'Company', placeholder: 'Organization', type: 'text' },
    { key: 'message', label: 'What can we do for you?', placeholder: 'State your purpose...', type: 'textarea' }
  ];

  const currentStep = steps[step];
  const totalSteps = steps.length;
  const progress = ((step + 1) / totalSteps) * 100;

  // Optimized focus management using callback ref
  // This ensures focus is applied exactly when the new input mounts
  const focusInput = useCallback((node: HTMLInputElement | HTMLTextAreaElement | null) => {
    if (node) {
      // Prevent scroll jumping if possible, though standard behavior is fine
      // Slight timeout to ensure Framer Motion has started the entry phase
      setTimeout(() => {
        node.focus({ preventScroll: true });
      }, 10);
      inputRef.current = node;
    }
  }, []);

  const handleNext = () => {
    const currentKey = currentStep.key as keyof typeof formData;
    const currentValue = formData[currentKey];

    if (!currentValue.trim()) {
      setError(true);
      return;
    }
    
    if (currentKey === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(currentValue)) {
        setError(true);
        return;
      }
    }
    
    setError(false);
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      submitForm();
    }
  };

  const submitForm = async () => {
    setStatus('submitting');

    try {
      const response = await fetch('https://formspree.io/f/xkglgndw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentStep.type === 'textarea' && e.shiftKey) return;
      e.preventDefault();
      handleNext();
    }
  };

  const handleChange = (val: string) => {
    setFormData(prev => ({ ...prev, [currentStep.key]: val }));
    if (error) setError(false);
  };

  return (
    <section id="contact" className={`py-32 md:py-48 px-6 relative overflow-hidden min-h-[80vh] flex items-center transition-colors duration-500
      ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      
      <style>{`
        .terminal-loader {
          border: 1px solid ${theme === 'dark' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(0,0,0,0.2)'};
          background-color: #0A0A0A;
          color: #FFD700;
          font-family: "Space Grotesk", "Courier New", monospace;
          font-size: 1em;
          padding: 1.5em 1em;
          width: 22em;
          max-width: 100%;
          box-shadow: 0 4px 20px ${theme === 'dark' ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0,0,0,0.2)'};
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          margin: 0 auto;
        }

        .terminal-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1.5em;
          background-color: #1a1a1a;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          padding: 0 0.4em;
          box-sizing: border-box;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .terminal-controls {
          float: right;
        }

        .control {
          display: inline-block;
          width: 0.6em;
          height: 0.6em;
          margin-left: 0.4em;
          border-radius: 50%;
          background-color: #777;
        }

        .control.close { background-color: #e33; }
        .control.minimize { background-color: #ee0; }
        .control.maximize { background-color: #0b0; }

        .terminal-title {
          float: left;
          line-height: 1.5em;
          color: #eee;
          font-size: 0.8em;
        }

        .text {
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          border-right: 0.2em solid #FFD700;
          animation: typeAndDelete 4s steps(25) infinite, blinkCursor 0.5s step-end infinite alternate;
          margin-top: 1.5em;
        }

        @keyframes blinkCursor {
          50% { border-right-color: transparent; }
        }

        @keyframes typeAndDelete {
          0%, 10% { width: 0; }
          45%, 55% { width: 24ch; }
          90%, 100% { width: 0; }
        }
      `}</style>

      {/* Background Ambient Light */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full blur-[150px] -z-10 pointer-events-none opacity-5
        ${theme === 'dark' ? 'bg-gold-light' : 'bg-gold-dark'}`} />

      <div className="container mx-auto max-w-4xl relative z-10">
        
        {/* Header Area */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className={`text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight
            ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Reach Out
          </h2>
          <p className={`text-lg md:text-xl font-mono tracking-widest uppercase opacity-70
            ${theme === 'dark' ? 'text-gold-light' : 'text-gold-dark'}`}>
            Signal ready. Establish connection.
          </p>
        </motion.div>

        <div className="min-h-[400px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-2xl"
              >
                {/* Progress Bar */}
                <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full mb-12 overflow-hidden">
                  <motion.div 
                    className={`h-full ${theme === 'dark' ? 'bg-gold-light' : 'bg-gold-dark'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                  />
                </div>

                {/* Field Container */}
                <AnimatePresence mode="wait" custom={step}>
                  <motion.div
                    key={step}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }} // Faster transition
                    className="relative"
                  >
                    <label className={`block text-sm font-bold uppercase tracking-[0.2em] mb-4
                      ${theme === 'dark' ? 'text-secondary' : 'text-secondaryLight'}`}>
                      {currentStep.label} 
                      {error && (
                        <span className="text-red-500 ml-2 normal-case tracking-normal">
                          {currentStep.key === 'email' && formData.email.trim() ? '* invalid coordinates' : '* required'}
                        </span>
                      )}
                    </label>

                    <div className="relative group">
                      {currentStep.type === 'textarea' ? (
                        <textarea
                          ref={focusInput}
                          value={formData[currentStep.key as keyof typeof formData]}
                          onChange={(e) => handleChange(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={currentStep.placeholder}
                          autoFocus
                          className={`w-full bg-transparent border-b-2 py-6 text-2xl md:text-4xl font-light focus:outline-none resize-none transition-all duration-300 min-h-[200px]
                            ${error ? 'border-red-500' : (theme === 'dark' ? 'border-white/10 focus:border-gold-light text-white placeholder-white/50' : 'border-black/10 focus:border-gold-dark text-black placeholder-black/30')}`}
                        />
                      ) : (
                        <input
                          ref={focusInput}
                          type={currentStep.type}
                          value={formData[currentStep.key as keyof typeof formData]}
                          onChange={(e) => handleChange(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={currentStep.placeholder}
                          autoFocus
                          className={`w-full bg-transparent border-b-2 py-6 text-2xl md:text-5xl font-light focus:outline-none transition-all duration-300
                            ${error ? 'border-red-500' : (theme === 'dark' ? 'border-white/10 focus:border-gold-light text-white placeholder-white/50' : 'border-black/10 focus:border-gold-dark text-black placeholder-black/30')}`}
                        />
                      )}
                      
                      {/* Next Button / Enter Hint */}
                      <div className="absolute right-0 bottom-6 flex items-center gap-4">
                        <span className={`hidden md:flex items-center gap-2 text-xs uppercase tracking-widest font-bold opacity-50 pointer-events-none
                          ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                          Press Enter <CornerDownLeft size={14} />
                        </span>
                        <button
                          onClick={handleNext}
                          className={`p-4 rounded-full transition-all duration-300 hover:scale-110 active:scale-95
                            ${theme === 'dark' 
                              ? 'bg-white/10 text-gold-light hover:bg-gold-light hover:text-black' 
                              : 'bg-black/5 text-gold-dark hover:bg-gold-dark hover:text-white'}`}
                        >
                          <ArrowRight size={24} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                <div className={`mt-8 text-sm font-mono opacity-40
                  ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Step {step + 1} / {totalSteps}
                </div>
              </motion.div>
            )}

            {status === 'submitting' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="w-full text-center"
              >
                <div className="terminal-loader">
                  <div className="terminal-header">
                    <div className="terminal-title">Status</div>
                    <div className="terminal-controls">
                      <div className="control close"></div>
                      <div className="control minimize"></div>
                      <div className="control maximize"></div>
                    </div>
                  </div>
                  <div className="text">Contacting Mothership...</div>
                </div>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                 <div className={`inline-flex p-8 rounded-full mb-8
                    ${theme === 'dark' ? 'bg-gold-light/20 text-gold-light' : 'bg-gold-dark/10 text-gold-dark'}`}>
                    <Check size={64} strokeWidth={1.5} />
                  </div>
                <h3 className={`text-2xl md:text-4xl font-heading font-bold mb-4 tracking-tight
                  ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Transmission Received
                </h3>
                <p className={`text-lg md:text-xl font-mono
                  ${theme === 'dark' ? 'text-gold-light' : 'text-gold-dark'}`}>
                  Your message has been delivered, Earthling.
                </p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className={`inline-flex p-8 rounded-full mb-8 bg-red-500/20 text-red-500`}>
                  <AlertCircle size={64} strokeWidth={1.5} />
                </div>
                <h3 className={`text-2xl md:text-4xl font-heading font-bold mb-4 tracking-tight
                  ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  Transmission Failed
                </h3>
                <p className={`text-lg md:text-xl font-mono mb-8
                  ${theme === 'dark' ? 'text-secondary' : 'text-secondaryLight'}`}>
                  Signal interrupted. Please try again.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className={`px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:scale-105
                    ${theme === 'dark'
                      ? 'bg-gold-light text-black hover:bg-white'
                      : 'bg-gold-dark text-white hover:bg-black'}`}
                >
                  Retry Transmission
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Contact;