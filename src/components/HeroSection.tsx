import React from 'react';
import { ArrowDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero-section" aria-label="Landing Hero">
      <div className="hero-backdrop">
        <img
          src="/assets/landing/family-of-jack-daniels.jpg"
          alt="The Legendary Family of Jack Daniel's Tennessee Whiskeys"
          className="hero-img"
          fetchPriority="high"
        />
        <div className="hero-gradient"></div>
        <div className="hero-ambient-glow"></div>
      </div>

      <div className="hero-body">
        <div className="hero-eyebrow">
          <span className="eyebrow-dot"></span>
          <span>EST. 1866 • LYNCHBURG, TENNESSEE</span>
          <span className="eyebrow-dot"></span>
        </div>

        <h1 className="hero-title">
          THE FAMILY OF <br />
          <span className="gold-gradient-text">JACK DANIEL'S</span>
        </h1>

        <p className="hero-copy">
          A Tennessee whiskey tradition shaped by time, craftsmanship, charcoal mellowing and patient maturation.
        </p>

        <div className="hero-ctas">
          <button onClick={() => scrollTo('#pour-experience')} className="btn btn-primary">
            <span>Experience The Pour</span>
            <ArrowDown size={16} />
          </button>
          <button onClick={() => scrollTo('#collection')} className="btn btn-secondary">
            <span>Explore The Collection</span>
          </button>
        </div>

        <div
          className="hero-scroll-indicator"
          onClick={() => scrollTo('#pour-experience')}
          role="button"
          tabIndex={0}
        >
          <span className="scroll-text">SCROLL TO EXPLORE</span>
          <ArrowDown size={18} className="scroll-arrow" color="#c5a059" />
        </div>
      </div>
    </section>
  );
};
