import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export const PremiumSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [metersVisible, setMetersVisible] = useState(false);

  // Auto-play when video enters viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().then(() => setIsPlaying(true)).catch(() => {});
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Animate intensity bars when in viewport
  useEffect(() => {
    const target = meterRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setMetersVisible(true);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setVideoProgress((video.currentTime / video.duration) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    video.currentTime = clickPos * video.duration;
  };

  return (
    <section id="premium" className="section-premium" aria-label="Premium Experience">
      <div className="section-header">
        <div className="section-eyebrow">THE PREMIUM EXPERIENCE</div>
        <h2 className="section-title">CRAFTED FOR THE SLOW POUR</h2>
        <div className="gold-divider"></div>
        <p className="section-subtitle">
          Explore the depth and character created through time, oak and Tennessee craftsmanship.
        </p>
      </div>

      <div className="premium-split">
        {/* 45% LEFT: Sticky Image */}
        <div className="premium-left">
          <div className="sticky-image-container">
            <img
              src="/assets/premium/luxury-section.jpg"
              alt="Jack Daniel's Single Barrel Presentation"
              className="premium-img"
              loading="lazy"
            />
            <div className="image-badge-overlay">
              <div className="badge-tag">SINGLE BARREL SELECT</div>
              <div className="badge-desc">Bottled at 94 proof with robust character and subtle toasted notes.</div>
            </div>
          </div>
        </div>

        {/* 55% RIGHT: Video & Tasting Notes */}
        <div className="premium-right">
          {/* Custom Video Box */}
          <div className="luxury-video-box">
            <div className="video-frame">
              <video
                ref={videoRef}
                className="html5-video"
                src="/assets/premium/whiskey-pour.mp4"
                playsInline
                loop
                muted
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
              />
              <div className="video-tint"></div>

              {/* Luxury Controls */}
              <div className="video-controls">
                <button onClick={togglePlay} className="video-btn" aria-label={isPlaying ? 'Pause' : 'Play'}>
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                <div className="video-seek-track" onClick={handleSeek}>
                  <div className="video-seek-fill" style={{ width: `${videoProgress}%` }}></div>
                </div>

                <button onClick={toggleMute} className="video-btn" aria-label={isMuted ? 'Unmute' : 'Mute'}>
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              </div>
            </div>

            <div className="video-caption">
              <span className="pulse-dot"></span>
              <span>CINEMATIC POUR • 120 FPS HIGH DEFINITION</span>
            </div>
          </div>

          {/* Sensory Panel */}
          <div className="sensory-panel">
            <h3 className="panel-title">TASTING NOTES</h3>

            <div className="tasting-columns">
              <div className="tasting-col">
                <h4 className="tasting-heading">AROMA</h4>
                <ul className="tasting-notes-list">
                  <li>Charcoal</li>
                  <li>Toasted oak</li>
                  <li>Vanilla</li>
                </ul>
              </div>

              <div className="tasting-col">
                <h4 className="tasting-heading">PALATE</h4>
                <ul className="tasting-notes-list">
                  <li>Caramel</li>
                  <li>Brown sugar</li>
                  <li>Roasted oak</li>
                </ul>
              </div>

              <div className="tasting-col">
                <h4 className="tasting-heading">FINISH</h4>
                <ul className="tasting-notes-list">
                  <li>Warm oak</li>
                  <li>Soft spice</li>
                  <li>Long lingering finish</li>
                </ul>
              </div>
            </div>

            {/* Flavor Intensity Bars */}
            <div ref={meterRef} className="intensity-block">
              <div className="intensity-row">
                <div className="intensity-labels">
                  <span>CHARCOAL SMOOTHNESS</span>
                  <span>95%</span>
                </div>
                <div className="intensity-meter-track">
                  <div
                    className="intensity-meter-fill"
                    style={{ width: metersVisible ? '95%' : '0%' }}
                  ></div>
                </div>
              </div>

              <div className="intensity-row">
                <div className="intensity-labels">
                  <span>TOASTED OAK</span>
                  <span>92%</span>
                </div>
                <div className="intensity-meter-track">
                  <div
                    className="intensity-meter-fill"
                    style={{ width: metersVisible ? '92%' : '0%' }}
                  ></div>
                </div>
              </div>

              <div className="intensity-row">
                <div className="intensity-labels">
                  <span>CARAMEL & VANILLA</span>
                  <span>88%</span>
                </div>
                <div className="intensity-meter-track">
                  <div
                    className="intensity-meter-fill"
                    style={{ width: metersVisible ? '88%' : '0%' }}
                  ></div>
                </div>
              </div>
            </div>

            <a href="#special-packages" className="btn btn-primary">
              <span>Request Private Allocation</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
