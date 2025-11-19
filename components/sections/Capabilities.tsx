import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Cpu, Network, ShieldCheck } from 'lucide-react';

const capabilities = [
  {
    icon: Cpu,
    title: "Proprietary Systems",
    description: "Custom-built operational architectures designed for specific challenges that off-the-shelf SaaS cannot address."
  },
  {
    icon: Network,
    title: "Advanced Automation",
    description: "Intelligent workflows that adapt to your scale, tested rigorously within our own operational ecosystem."
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Operations",
    description: "Where technical execution meets deep operational strategy. We build what is necessary, not just what is possible."
  }
];

const Capabilities: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section id="capabilities" className={`py-32 md:py-40 px-6 transition-colors duration-500 relative overflow-hidden
      ${theme === 'dark' ? 'bg-charcoal' : 'bg-gray-50'}`}>
      
      {/* Subtle background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b pointer-events-none
        ${theme === 'dark' ? 'from-charcoal to-black' : 'from-gray-50 to-white'}`} />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {capabilities.map((cap, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.8, ease: "easeOut" }}
              whileHover={{ 
                y: -12, 
                scale: 1.02,
                boxShadow: theme === 'dark' ? '0 20px 40px -10px rgba(255, 215, 0, 0.1)' : '0 20px 40px -10px rgba(0,0,0,0.1)'
              }}
              className={`p-10 md:p-12 rounded-xl border transition-all duration-300 cursor-hover group flex flex-col
                ${theme === 'dark' 
                  ? 'bg-[#111] border-white/5 hover:border-gold-light/50' 
                  : 'bg-white border-black/5 hover:border-gold-dark/50 shadow-xl shadow-black/5'}`}
            >
              <div className={`mb-8 p-4 rounded-full w-fit transition-colors duration-300
                ${theme === 'dark' ? 'bg-white/5 text-gold-light group-hover:bg-gold-light/10' : 'bg-gold-light/10 text-gold-dark'}`}>
                <cap.icon size={48} strokeWidth={1.5} />
              </div>
              
              <h3 className={`text-3xl font-heading font-bold mb-6 leading-tight
                ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                {cap.title}
              </h3>
              
              <p className={`text-lg leading-relaxed mb-8 flex-grow
                ${theme === 'dark' ? 'text-secondary' : 'text-secondaryLight'}`}>
                {cap.description}
              </p>
              
              <div className={`h-0.5 w-12 transition-all duration-500 group-hover:w-full
                ${theme === 'dark' ? 'bg-gold-light' : 'bg-gold-dark'}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Capabilities;