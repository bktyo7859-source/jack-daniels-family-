import React, { useEffect, useRef, useState } from 'react';

interface CinematicScrollProps {
  onLoadProgress: (loaded: number, total: number) => void;
  onInitialReady: () => void;
}

const TOTAL_FRAMES = 300;
const FRAME_PREFIX = '/assets/frames/ezgif-frame-';
const FRAME_EXT = '.png';

function getFrameUrl(index: number): string {
  const num = String(index + 1).padStart(3, '0');
  return `${FRAME_PREFIX}${num}${FRAME_EXT}`;
}

export const CinematicScroll: React.FC<CinematicScrollProps> = ({
  onLoadProgress,
  onInitialReady,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Performance refs to completely bypass React render cycles on scroll
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const isRenderingRef = useRef<boolean>(false);
  const loadedCountRef = useRef<number>(0);

  // Active Narrative Chapter state
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [scrubStats, setScrubStats] = useState({ frame: 1, percent: 0 });

  // 1. Intelligent Progressive Preloading
  useEffect(() => {
    let isCancelled = false;

    const loadSingleImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (imagesRef.current[index]) {
          resolve();
          return;
        }

        const img = new Image();
        img.src = getFrameUrl(index);
        img.onload = () => {
          if (!isCancelled) {
            imagesRef.current[index] = img;
            loadedCountRef.current++;
            onLoadProgress(loadedCountRef.current, TOTAL_FRAMES);
          }
          resolve();
        };
        img.onerror = () => {
          if (!isCancelled) {
            // Fallback to initial frame
            imagesRef.current[index] = imagesRef.current[0] || null;
            loadedCountRef.current++;
            onLoadProgress(loadedCountRef.current, TOTAL_FRAMES);
          }
          resolve();
        };
      });
    };

    const loadInBatches = async (startIndex: number, endIndex: number, concurrency: number) => {
      for (let i = startIndex; i < endIndex; i += concurrency) {
        if (isCancelled) break;
        const chunk = [];
        for (let j = i; j < Math.min(i + concurrency, endIndex); j++) {
          chunk.push(loadSingleImage(j));
        }
        await Promise.all(chunk);
      }
    };

    const executeProgressivePreload = async () => {
      // Priority 1: 001 - 030 (Instant startup)
      await loadInBatches(0, 30, 10);
      if (isCancelled) return;

      // Draw initial frame and signal readiness
      resizeAndDraw();
      onInitialReady();

      // Priority 2: 031 - 100
      await loadInBatches(30, 100, 12);
      if (isCancelled) return;

      // Priority 3: 101 - 200
      await loadInBatches(100, 200, 15);
      if (isCancelled) return;

      // Priority 4: 201 - 300
      await loadInBatches(200, 300, 15);
    };

    executeProgressivePreload();

    return () => {
      isCancelled = true;
    };
  }, [onInitialReady, onLoadProgress]);

  // 2. High-DPI Canvas Draw Method
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Explicit clamp to [0, 299]
    const clampedIndex = Math.max(0, Math.min(299, frameIndex));

    // Fallback search to nearest loaded frame to avoid any white/empty frames
    let img = imagesRef.current[clampedIndex];
    if (!img) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (clampedIndex - offset >= 0 && imagesRef.current[clampedIndex - offset]) {
          img = imagesRef.current[clampedIndex - offset];
          break;
        }
        if (clampedIndex + offset < TOTAL_FRAMES && imagesRef.current[clampedIndex + offset]) {
          img = imagesRef.current[clampedIndex + offset];
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    // Clear background with near-black matte
    ctx.fillStyle = '#060608';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Aspect ratio preservation (contain mode)
    const imgWidth = img.naturalWidth || 1080;
    const imgHeight = img.naturalHeight || 1920;
    const imgAspect = imgWidth / imgHeight;
    const canvasAspect = canvasWidth / canvasHeight;

    let renderWidth: number;
    let renderHeight: number;
    let renderX: number;
    let renderY: number;

    if (canvasAspect > imgAspect) {
      // Wider canvas: fit height
      renderHeight = canvasHeight;
      renderWidth = renderHeight * imgAspect;
      renderX = (canvasWidth - renderWidth) / 2;
      renderY = 0;
    } else {
      // Taller canvas: fit width
      renderWidth = canvasWidth;
      renderHeight = renderWidth / imgAspect;
      renderX = 0;
      renderY = (canvasHeight - renderHeight) / 2;
    }

    // Subtle centered amber atmospheric backlight
    const glowRadius = Math.min(renderWidth, renderHeight) * 0.45;
    const glow = ctx.createRadialGradient(
      canvasWidth / 2,
      canvasHeight / 2,
      10,
      canvasWidth / 2,
      canvasHeight / 2,
      glowRadius
    );
    glow.addColorStop(0, 'rgba(229, 142, 38, 0.12)');
    glow.addColorStop(1, 'rgba(6, 6, 8, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw frame
    ctx.drawImage(img, renderX, renderY, renderWidth, renderHeight);
  };

  const resizeAndDraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext('2d', { alpha: false });
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    drawFrame(Math.max(0, Math.min(299, Math.round(currentFrameRef.current))));
  };

  // 3. Scroll Physics Loop (rAF + lerp)
  useEffect(() => {
    const renderLoop = () => {
      const LERP = 0.12;
      const frameDiff = targetFrameRef.current - currentFrameRef.current;
      const progressDiff = targetProgressRef.current - currentProgressRef.current;

      if (Math.abs(frameDiff) > 0.005) {
        currentFrameRef.current += frameDiff * LERP;
        currentProgressRef.current += progressDiff * LERP;
      } else {
        currentFrameRef.current = targetFrameRef.current;
        currentProgressRef.current = targetProgressRef.current;
        isRenderingRef.current = false;
      }

      // Explicit clamp on rendered frame [0, 299]
      const frameIndex = Math.max(0, Math.min(299, Math.round(currentFrameRef.current)));
      drawFrame(frameIndex);

      const pct = Math.round(currentProgressRef.current * 100);
      setScrubStats({ frame: frameIndex + 1, percent: pct });

      // Narrative chapter thresholds (fades away after 96%)
      const p = currentProgressRef.current;
      if (p >= 0.08 && p <= 0.26) {
        setActiveChapter(1);
      } else if (p >= 0.32 && p <= 0.50) {
        setActiveChapter(2);
      } else if (p >= 0.56 && p <= 0.74) {
        setActiveChapter(3);
      } else if (p >= 0.80 && p <= 0.96) {
        setActiveChapter(4);
      } else {
        setActiveChapter(null);
      }

      if (isRenderingRef.current) {
        requestAnimationFrame(renderLoop);
      }
    };

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollDistance = section.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollDistance);
      let progress = scrollDistance > 0 ? scrolled / scrollDistance : 0;

      // Strict boundary conditions
      if (progress <= 0) {
        progress = 0;
      }
      if (progress >= 1) {
        progress = 1;
      }

      targetProgressRef.current = progress;
      targetFrameRef.current = progress === 1 ? 299 : Math.max(0, Math.min(299, progress * 299));

      if (!isRenderingRef.current) {
        isRenderingRef.current = true;
        requestAnimationFrame(renderLoop);
      }
    };

    const handleResize = () => {
      resizeAndDraw();
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial positioning calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      id="pour-experience"
      ref={sectionRef}
      className="cinematic-scroll"
      aria-label="Cinematic Pour Experience"
    >
      <div className="cinematic-sticky">
        <canvas id="cinematic-canvas" ref={canvasRef} className="cinematic-canvas" />
        <div className="cinematic-overlay" />

        {/* Right Scrub Meta Indicator */}
        <div className="cinematic-scrub-indicator" aria-hidden="true">
          <div className="scrub-track">
            <div className="scrub-fill" style={{ height: `${scrubStats.percent}%` }} />
          </div>
          <div className="scrub-meta">
            <span>
              FRAME {String(scrubStats.frame).padStart(3, '0')} / {TOTAL_FRAMES}
            </span>
            <span className="scrub-pct">{scrubStats.percent}%</span>
          </div>
        </div>

        {/* Floating Editorial Narrative Overlays */}
        <div className="narrative-container">
          {/* Chapter 1 */}
          <div className={`narrative-card chapter-1 ${activeChapter === 1 ? 'active' : ''}`}>
            <div className="chapter-badge">
              <span>CHAPTER 01</span>
              <span className="chapter-line"></span>
              <span>THE PURITY</span>
            </div>
            <h3 className="chapter-title">Cave Spring Hollow Water</h3>
            <p className="chapter-copy">
              Everything begins with the water. Drawn from the limestone-filtered Cave Spring Hollow, it gives Tennessee whiskey its foundation.
            </p>
          </div>

          {/* Chapter 2 */}
          <div className={`narrative-card chapter-2 ${activeChapter === 2 ? 'active' : ''}`}>
            <div className="chapter-badge">
              <span>CHAPTER 02</span>
              <span className="chapter-line"></span>
              <span>THE PROCESS</span>
            </div>
            <h3 className="chapter-title">Charcoal Mellowed Drop by Drop</h3>
            <p className="chapter-copy">
              Every drop passes slowly through charcoal, creating the signature smooth character associated with Tennessee whiskey.
            </p>
          </div>

          {/* Chapter 3 */}
          <div className={`narrative-card chapter-3 ${activeChapter === 3 ? 'active' : ''}`}>
            <div className="chapter-badge">
              <span>CHAPTER 03</span>
              <span className="chapter-line"></span>
              <span>THE BARREL</span>
            </div>
            <h3 className="chapter-title">Hand-Toasted White Oak</h3>
            <p className="chapter-copy">
              New American white oak barrels shape the spirit with layers of toasted oak, caramel and vanilla.
            </p>
          </div>

          {/* Chapter 4 */}
          <div className={`narrative-card chapter-4 ${activeChapter === 4 ? 'active' : ''}`}>
            <div className="chapter-badge">
              <span>CHAPTER 04</span>
              <span className="chapter-line"></span>
              <span>THE POUR</span>
            </div>
            <h3 className="chapter-title">Liquid Gold Over Hand-Cut Ice</h3>
            <p className="chapter-copy">
              Time, wood and patience become something meant to be poured slowly and savored.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
