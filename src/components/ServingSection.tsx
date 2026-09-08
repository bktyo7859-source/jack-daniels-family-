import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, ArrowUp, ArrowRight } from 'lucide-react';

interface ServeCardItem {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  ritualNote: string;
}

const serveMethods: ServeCardItem[] = [
  {
    number: '01',
    title: 'NEAT',
    subtitle: 'Pure & Unhurried',
    description: 'Poured directly into a curved tulip glass or heavy tumbler at room temperature. Allows the full spectrum of toasted oak, vanilla, and charcoal smoothness to express itself without dilution.',
    ritualNote: 'Best enjoyed in a quiet setting to appreciate the lingering warm finish.',
  },
  {
    number: '02',
    title: 'ON THE ROCKS',
    subtitle: 'Over Hand-Cut Ice',
    description: 'Served over a single large, slow-melting crystal ice cube. Chilling slightly softens the spirit while unlocking delicate layers of roasted pecan, honey, and subtle caramel sweetness.',
    ritualNote: 'Swirl gently and let the temperature evolve over several minutes.',
  },
  {
    number: '03',
    title: 'OLD FASHIONED',
    subtitle: 'A Timeless Classic',
    description: 'Two ounces of Jack Daniel’s, two dashes of Angostura bitters, a barspoon of demerara syrup, and expressed orange peel. A balanced celebration of American cocktail heritage.',
    ritualNote: 'Garnish with a brandied cherry and a flamed orange twist.',
  },
];

export const ServingSection: React.FC = () => {
  // Video 1 (Hero Video - Old Fashioned)
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [heroPlaying, setHeroPlaying] = useState(false);
  const [heroMuted, setHeroMuted] = useState(true);
  const [heroProgress, setHeroProgress] = useState(0);

  // Video 2 (Secondary Video - Honey / Expression)
  const secVideoRef = useRef<HTMLVideoElement>(null);
  const [secPlaying, setSecPlaying] = useState(false);
  const [secMuted, setSecMuted] = useState(true);
  const [secProgress, setSecProgress] = useState(0);

  // Auto-play / pause on viewport entry for hero video
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().then(() => setHeroPlaying(true)).catch(() => {});
          } else {
            video.pause();
            setHeroPlaying(false);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Controls for Hero Video
  const toggleHeroPlay = () => {
    const v = heroVideoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setHeroPlaying(true);
    } else {
      v.pause();
      setHeroPlaying(false);
    }
  };

  const toggleHeroMute = () => {
    const v = heroVideoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setHeroMuted(v.muted);
  };

  const handleHeroTimeUpdate = () => {
    const v = heroVideoRef.current;
    if (!v || !v.duration) return;
    setHeroProgress((v.currentTime / v.duration) * 100);
  };

  const handleHeroSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = heroVideoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
  };

  // Controls for Secondary Video
  const toggleSecPlay = () => {
    const v = secVideoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setSecPlaying(true);
    } else {
      v.pause();
      setSecPlaying(false);
    }
  };

  const toggleSecMute = () => {
    const v = secVideoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setSecMuted(v.muted);
  };

  const handleSecTimeUpdate = () => {
    const v = secVideoRef.current;
    if (!v || !v.duration) return;
    setSecProgress((v.currentTime / v.duration) * 100);
  };

  const handleSecSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = secVideoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
  };

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="serve" className="section-serve" aria-label="How to Serve Jack Daniel's">
      {/* Editorial Header */}
      <div className="section-header">
        <div className="section-eyebrow">HOW TO SERVE</div>
        <h2 className="section-title">THE ART OF THE POUR</h2>
        <div className="gold-divider"></div>
        <p className="section-subtitle">
          There is no single way to enjoy Tennessee whiskey. Discover the rituals, serves and cocktails that bring each expression to life.
        </p>
      </div>

      {/* Primary Cinematic Serve Video Box */}
      <div className="serve-hero-video-container">
        <div className="luxury-video-box">
          <div className="video-frame">
            <video
              ref={heroVideoRef}
              className="html5-video"
              src="/assets/serve/old-fashioned-serve.mp4"
              playsInline
              loop
              muted
              preload="metadata"
              onTimeUpdate={handleHeroTimeUpdate}
            />
            <div className="video-tint"></div>

            {/* Custom Luxury Controls */}
            <div className="video-controls">
              <button onClick={toggleHeroPlay} className="video-btn" aria-label={heroPlaying ? 'Pause' : 'Play'}>
                {heroPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <div className="video-seek-track" onClick={handleHeroSeek}>
                <div className="video-seek-fill" style={{ width: `${heroProgress}%` }}></div>
              </div>
              <button onClick={toggleHeroMute} className="video-btn" aria-label={heroMuted ? 'Unmute' : 'Mute'}>
                {heroMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </div>
          <div className="video-caption">
            <span className="pulse-dot"></span>
            <span>THE MASTER SERVE • HAND-CRAFTED COCKTAIL RITUAL</span>
          </div>
        </div>
      </div>

      {/* 3 Serving Method Cards */}
      <div className="serve-methods-grid">
        {serveMethods.map((m) => (
          <div key={m.number} className="serve-card">
            <div className="serve-card-header">
              <span className="serve-num">{m.number}</span>
              <span className="serve-badge">SIGNATURE SERVE</span>
            </div>
            <h3 className="serve-name">{m.title}</h3>
            <p className="serve-tagline">{m.subtitle}</p>
            <p className="serve-desc">{m.description}</p>
            <div className="serve-ritual">
              <span className="ritual-tag">RITUAL NOTE:</span> {m.ritualNote}
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Expression Experience Video */}
      <div className="serve-secondary-block">
        <div className="secondary-video-split">
          <div className="sec-video-content">
            <div className="sec-badge">EXPLORE THE EXPRESSIONS</div>
            <h3 className="sec-title">
              EVERY EXPRESSION <br />
              <span className="gold-gradient-text">HAS ITS MOMENT.</span>
            </h3>
            <p className="sec-copy">
              From the bold intensity of Single Barrel to the smooth, rich notes of Tennessee Honey, explore how different serving rituals unlock distinctive flavor notes across our whiskey collection.
            </p>
            <button onClick={() => scrollTo('#collection')} className="btn btn-secondary">
              <span>View The Collection</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="sec-video-player-wrap">
            <div className="luxury-video-box">
              <div className="video-frame">
                <video
                  ref={secVideoRef}
                  className="html5-video"
                  src="/assets/serve/trying-honey-whiskey.mp4"
                  playsInline
                  loop
                  muted
                  preload="metadata"
                  onTimeUpdate={handleSecTimeUpdate}
                />
                <div className="video-tint"></div>

                <div className="video-controls">
                  <button onClick={toggleSecPlay} className="video-btn" aria-label={secPlaying ? 'Pause' : 'Play'}>
                    {secPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <div className="video-seek-track" onClick={handleSecSeek}>
                    <div className="video-seek-fill" style={{ width: `${secProgress}%` }}></div>
                  </div>
                  <button onClick={toggleSecMute} className="video-btn" aria-label={secMuted ? 'Unmute' : 'Mute'}>
                    {secMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>
              </div>
              <div className="video-caption">
                <span className="pulse-dot"></span>
                <span>TASTING & EXPRESSIONS EXPLORATION</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Call to Action */}
      <div className="serve-final-cta">
        <span className="cta-eyebrow">YOUR POUR. YOUR RITUAL.</span>
        <h3 className="cta-heading">HOW WILL YOU POUR IT?</h3>
        <div className="cta-buttons-group">
          <button onClick={() => scrollTo('#collection')} className="btn btn-primary">
            <span>Explore The Collection</span>
            <ArrowRight size={16} />
          </button>
          <button onClick={() => scrollTo('#hero')} className="btn btn-secondary">
            <span>Back to The Top</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};
