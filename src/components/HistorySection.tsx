import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

const milestones: TimelineItem[] = [
  {
    year: '1866',
    title: 'THE BEGINNING',
    description: "Jack Daniel's establishes its distillery in Lynchburg, Tennessee, becoming America's first registered distillery.",
  },
  {
    year: '1866–1900s',
    title: 'THE CRAFT',
    description: 'The Tennessee whiskey-making tradition develops around sugar maple charcoal mellowing, precise distillation, and handcrafted charred barrels.',
  },
  {
    year: '1900s',
    title: 'A TENNESSEE ICON',
    description: 'The distinctive square bottle and iconic Old No. 7 black label identity become celebrated and recognized around the globe.',
  },
  {
    year: 'TODAY',
    title: 'THE LEGACY CONTINUES',
    description: "The Lynchburg tradition continues unaltered, while the Jack Daniel's family expands across new master-crafted expressions.",
  },
];

export const HistorySection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);

  // Auto-play / pause on viewport entry
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
      { threshold: 0.25 }
    );

    observer.observe(video);
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
    <section id="history" className="section-history" aria-label="The History of Jack Daniel's">
      {/* Editorial Header */}
      <div className="section-header">
        <div className="section-eyebrow">THE STORY BEHIND THE SPIRIT</div>
        <h2 className="section-title">A LEGACY AGED BY TIME</h2>
        <div className="gold-divider"></div>
        <p className="section-subtitle">
          From Lynchburg, Tennessee, a tradition of craftsmanship has shaped the character of Jack Daniel's for generations.
        </p>
      </div>

      {/* Vertical Editorial Timeline */}
      <div className="history-timeline-container">
        <div className="timeline-spine"></div>
        <div className="timeline-milestones">
          {milestones.map((m, index) => (
            <div key={index} className="timeline-node">
              <div className="timeline-dot"></div>
              <div className="timeline-year">{m.year}</div>
              <div className="timeline-card">
                <h3 className="timeline-heading">{m.title}</h3>
                <p className="timeline-desc">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video & Process Presentation */}
      <div className="history-process-split">
        {/* 55% Video */}
        <div className="history-video-col">
          <div className="luxury-video-box">
            <div className="video-frame">
              <video
                ref={videoRef}
                className="html5-video"
                src="/assets/history/how-whiskey-is-made.mp4"
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
              <span>HOW JACK DANIEL'S IS CRAFTED • LYNCHBURG DISTILLERY</span>
            </div>
          </div>
        </div>

        {/* 45% Editorial Process Content */}
        <div className="history-content-col">
          <div className="process-panel">
            <div className="process-eyebrow">UNCOMPROMISING HERITAGE</div>
            <h3 className="process-title">THE PROCESS BEHIND THE LEGEND</h3>
            
            <div className="process-points">
              <div className="process-point">
                <span className="point-num">01</span>
                <div>
                  <h4 className="point-heading">Cave Spring Hollow Water</h4>
                  <p className="point-text">Drawn directly from limestone caves, completely iron-free and naturally chilled at 56°F year-round.</p>
                </div>
              </div>

              <div className="process-point">
                <span className="point-num">02</span>
                <div>
                  <h4 className="point-heading">Charcoal Mellowing (The Lincoln County Process)</h4>
                  <p className="point-text">Filtered drop by drop through ten feet of sugar maple charcoal, purifying and smoothing the whiskey before barreling.</p>
                </div>
              </div>

              <div className="process-point">
                <span className="point-num">03</span>
                <div>
                  <h4 className="point-heading">Custom Toasted Oak Barrels</h4>
                  <p className="point-text">Every barrel is handcrafted by our own coopers, toasted and charred to impart rich vanilla and deep amber color.</p>
                </div>
              </div>

              <div className="process-point">
                <span className="point-num">04</span>
                <div>
                  <h4 className="point-heading">Patience & Time</h4>
                  <p className="point-text">Aged until our master distillers judge by color, aroma, and taste that it has achieved peak perfection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Moment */}
      <div className="history-final-moment">
        <span className="moment-eyebrow">A TRADITION THAT ENDURES</span>
        <h3 className="moment-heading">
          TIME IS PART <br />
          <span className="gold-gradient-text">OF THE RECIPE.</span>
        </h3>
      </div>
    </section>
  );
};
