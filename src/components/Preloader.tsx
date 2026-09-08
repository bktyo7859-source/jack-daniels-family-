import React from 'react';

interface PreloaderProps {
  progress: number;
  loadedFrames: number;
  totalFrames: number;
  isReady: boolean;
}

export const Preloader: React.FC<PreloaderProps> = ({
  progress,
  loadedFrames,
  totalFrames,
  isReady,
}) => {
  return (
    <div className={`preloader ${isReady ? 'loaded' : ''}`} aria-live="polite">
      <div className="preloader-inner">
        <div className="preloader-crest">
          <svg viewBox="0 0 60 60" width="48" height="48" fill="none" stroke="currentColor">
            <circle cx="30" cy="30" r="28" stroke="#c5a059" strokeWidth="1.2" opacity="0.4" />
            <path
              d="M30 10 L30 50 M15 25 L45 25 M18 38 L42 38"
              stroke="#dfba73"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="30" cy="30" r="14" stroke="#c5a059" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        </div>
        <div className="preloader-eyebrow">EST. 1866 • LYNCHBURG, TN</div>
        <h2 className="preloader-title">LOADING THE EXPERIENCE</h2>
        <p className="preloader-subtitle">Charcoal Mellowed • Every Drop Handcrafted</p>

        <div className="preloader-track">
          <div className="preloader-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="preloader-stats">
          <span>{progress}%</span>
          <span>
            {loadedFrames} / {totalFrames} Frames
          </span>
        </div>
      </div>
    </div>
  );
};
