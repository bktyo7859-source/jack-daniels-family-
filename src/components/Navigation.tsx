import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAmbience = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (!isAudioActive) {
        // Generate subtle warm brown ambient hum
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.2;
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 280;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.035, ctx.currentTime);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        source.start(0);
        ambientNodeRef.current = source;
        setIsAudioActive(true);
      } else {
        if (ambientNodeRef.current) {
          ambientNodeRef.current.stop();
          ambientNodeRef.current.disconnect();
          ambientNodeRef.current = null;
        }
        setIsAudioActive(false);
      }
    } catch {
      // Browser audio policy handled
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`site-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="brand-link" aria-label="Jack Daniel's Home">
          <span className="brand-title">JACK DANIEL'S</span>
          <span className="brand-sub">TENNESSEE WHISKEY</span>
        </a>

        <nav className="nav-links" aria-label="Main Navigation">
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className={`nav-item ${activeSection === 'hero' ? 'active' : ''}`}
          >
            Heritage
          </a>
          <a
            href="#pour-experience"
            onClick={(e) => handleNavClick(e, '#pour-experience')}
            className={`nav-item ${activeSection === 'pour-experience' ? 'active' : ''}`}
          >
            The Experience
          </a>
          <a
            href="#premium"
            onClick={(e) => handleNavClick(e, '#premium')}
            className={`nav-item ${activeSection === 'premium' ? 'active' : ''}`}
          >
            Premium
          </a>
          <a
            href="#collection"
            onClick={(e) => handleNavClick(e, '#collection')}
            className={`nav-item ${activeSection === 'collection' ? 'active' : ''}`}
          >
            The Collection
          </a>
          <a
            href="#special-packages"
            onClick={(e) => handleNavClick(e, '#special-packages')}
            className={`nav-item ${activeSection === 'special-packages' ? 'active' : ''}`}
          >
            Special Packages
          </a>
          <a
            href="#history"
            onClick={(e) => handleNavClick(e, '#history')}
            className={`nav-item ${activeSection === 'history' ? 'active' : ''}`}
          >
            History
          </a>
          <a
            href="#serve"
            onClick={(e) => handleNavClick(e, '#serve')}
            className={`nav-item ${activeSection === 'serve' ? 'active' : ''}`}
          >
            How to Serve
          </a>
        </nav>

        <div className="nav-actions">
          <button
            onClick={toggleAmbience}
            className={`ambience-btn ${isAudioActive ? 'active' : ''}`}
            aria-label="Toggle Ambient Audio"
            title="Toggle Ambient Lounge Sound"
          >
            {isAudioActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>Ambience</span>
          </button>

          <a
            href="#special-packages"
            onClick={(e) => handleNavClick(e, '#special-packages')}
            className="btn btn-header"
          >
            Reserve
          </a>

          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};
