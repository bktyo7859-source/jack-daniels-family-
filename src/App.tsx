import React, { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { CinematicScroll } from './components/CinematicScroll';
import { PremiumSection } from './components/PremiumSection';
import { CollectionSection } from './components/CollectionSection';
import { SpecialPackagesSection } from './components/SpecialPackagesSection';
import { HistorySection } from './components/HistorySection';
import { ServingSection } from './components/ServingSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const handleLoadProgress = (loaded: number, total: number) => {
    setLoadedFrames(loaded);
    if (loaded >= total) {
      setTimeout(() => setIsReady(true), 350);
    }
  };

  const handleInitialReady = () => {
    // Initial batch loaded (first 30 frames ready), ready to unveil
    setTimeout(() => setIsReady(true), 400);
  };

  // Scroll Spy for active navigation highlight
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 250;
      const sections = ['hero', 'pour-experience', 'premium', 'collection', 'special-packages', 'history', 'serve'];

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const progressPct = Math.min(100, Math.round((loadedFrames / 300) * 100));

  return (
    <div className="app-container">
      <Preloader
        progress={progressPct}
        loadedFrames={loadedFrames}
        totalFrames={300}
        isReady={isReady}
      />

      <Navigation activeSection={activeSection} />

      <main>
        <HeroSection />
        <CinematicScroll
          onLoadProgress={handleLoadProgress}
          onInitialReady={handleInitialReady}
        />
        <PremiumSection />
        <CollectionSection />
        <SpecialPackagesSection />
        <HistorySection />
        <ServingSection />
      </main>

      <Footer />
    </div>
  );
};

export default App;
