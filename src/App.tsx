import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Capabilities from '../components/sections/Capabilities';
import Philosophy from '../components/sections/Philosophy';
import Approach from '../components/sections/Approach';
import Contact from '../components/sections/Contact';
import Background3D from '../components/visuals/Background3D';
import CustomCursor from '../components/visuals/CustomCursor';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <CustomCursor />
        <Background3D />
        <Navbar />
        <main>
          <Hero />
          <Capabilities />
          <Philosophy />
          <Approach />
          <Contact />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;
