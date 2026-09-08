/**
 * JACK DANIEL'S CINEMATIC EXPERIENCE
 * High-performance 300-Frame Canvas Scrubber, Smooth Lerp, and Luxury Interactions
 */

// Configuration Constants
const TOTAL_FRAMES = 300;
const FRAME_PATH_PREFIX = '/jack danials whisky/ezgif-frame-';
const FRAME_EXTENSION = '.png';

// State Management
const state = {
  frames: new Array(TOTAL_FRAMES),
  loadedFramesCount: 0,
  isPreloaded: false,
  targetProgress: 0,
  currentProgress: 0,
  targetFrame: 0,
  currentFrame: 0,
  isRendering: false,
  audioPlaying: false,
  audioContext: null,
  ambientNode: null,
};

// DOM Element References
const elements = {
  preloader: document.getElementById('preloader'),
  progressBarFill: document.getElementById('progress-bar-fill'),
  progressText: document.getElementById('progress-text'),
  frameLoadCount: document.getElementById('frame-load-count'),
  
  pourTrack: document.getElementById('pour-track'),
  pourStickyViewport: document.getElementById('pour-sticky-viewport'),
  canvas: document.getElementById('pour-canvas'),
  
  scrubLineFill: document.getElementById('scrub-line-fill'),
  scrubFrameLabel: document.getElementById('scrub-frame-label'),
  scrubPercentLabel: document.getElementById('scrub-percent-label'),
  
  storyCards: document.querySelectorAll('.story-card'),
  
  premiumVideo: document.getElementById('premium-video'),
  videoPlayBtn: document.getElementById('video-play-btn'),
  videoIconPlay: document.getElementById('video-icon-play'),
  videoIconPause: document.getElementById('video-icon-pause'),
  videoMuteBtn: document.getElementById('video-mute-btn'),
  videoVolMuted: document.getElementById('video-vol-muted'),
  videoVolUnmuted: document.getElementById('video-vol-unmuted'),
  videoProgressBar: document.getElementById('video-progress-bar'),
  videoTimeTrack: document.querySelector('.video-time-track'),
  
  audioToggleBtn: document.getElementById('audio-toggle-btn'),
  audioIconOff: document.getElementById('audio-icon-off'),
  audioIconOn: document.getElementById('audio-icon-on'),
  
  navLinks: document.querySelectorAll('.nav-link'),
  siteHeader: document.getElementById('site-header'),
};

const ctx = elements.canvas.getContext('2d', { alpha: false });

/**
 * Generate formatted frame URL
 * @param {number} index (0 to 299)
 * @returns {string}
 */
function getFrameUrl(index) {
  const frameNumber = String(index + 1).padStart(3, '0');
  return `${FRAME_PATH_PREFIX}${frameNumber}${FRAME_EXTENSION}`;
}

/**
 * Intelligent Stream Preloading of all 300 frames
 */
async function preloadFrames() {
  const BATCH_SIZE = 12; // Load in concurrent streams for maximum speed
  let loaded = 0;

  // Function to load a single frame
  const loadSingleImage = (index) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = getFrameUrl(index);
      img.onload = () => {
        state.frames[index] = img;
        loaded++;
        state.loadedFramesCount = loaded;
        updatePreloaderProgress(loaded);
        resolve();
      };
      img.onerror = () => {
        console.warn(`Frame ${index + 1} failed to load directly.`);
        // Fallback placeholder to prevent breaking
        state.frames[index] = state.frames[0] || null;
        loaded++;
        state.loadedFramesCount = loaded;
        updatePreloaderProgress(loaded);
        resolve();
      };
    });
  };

  // 1. High Priority: First 15 frames for instant initial render
  const initialBatch = [];
  for (let i = 0; i < Math.min(15, TOTAL_FRAMES); i++) {
    initialBatch.push(loadSingleImage(i));
  }
  await Promise.all(initialBatch);

  // Initial draw as soon as frame 0 is ready
  resizeCanvas();
  drawFrame(0);

  // 2. Load the remaining frames concurrently in batches
  const remainingIndices = [];
  for (let i = 15; i < TOTAL_FRAMES; i++) {
    remainingIndices.push(i);
  }

  for (let i = 0; i < remainingIndices.length; i += BATCH_SIZE) {
    const chunk = remainingIndices.slice(i, i + BATCH_SIZE);
    await Promise.all(chunk.map((index) => loadSingleImage(index)));
  }

  // Preloading complete
  state.isPreloaded = true;
  setTimeout(() => {
    if (elements.preloader) {
      elements.preloader.classList.add('loaded');
    }
  }, 400);
}

/**
 * Update Preloader Progress Bar and Stats
 */
function updatePreloaderProgress(loaded) {
  const percent = Math.min(100, Math.round((loaded / TOTAL_FRAMES) * 100));
  if (elements.progressBarFill) {
    elements.progressBarFill.style.width = `${percent}%`;
  }
  if (elements.progressText) {
    elements.progressText.textContent = `${percent}%`;
  }
  if (elements.frameLoadCount) {
    elements.frameLoadCount.textContent = `Cured ${loaded} of ${TOTAL_FRAMES} Frames`;
  }
}

/**
 * High-DPI Responsive Canvas Sizing
 */
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = elements.canvas.getBoundingClientRect();
  
  elements.canvas.width = Math.round(rect.width * dpr);
  elements.canvas.height = Math.round(rect.height * dpr);
  
  ctx.scale(dpr, dpr);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  // Re-draw current frame
  drawFrame(Math.round(state.currentFrame));
}

/**
 * Draw specified frame with contain aspect-ratio fitting and deep matte background
 */
function drawFrame(frameIndex) {
  const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex));
  
  // Find nearest available loaded frame if exact frame isn't ready
  let img = state.frames[clampedIndex];
  if (!img) {
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      if (clampedIndex - offset >= 0 && state.frames[clampedIndex - offset]) {
        img = state.frames[clampedIndex - offset];
        break;
      }
      if (clampedIndex + offset < TOTAL_FRAMES && state.frames[clampedIndex + offset]) {
        img = state.frames[clampedIndex + offset];
        break;
      }
    }
  }

  if (!img || !img.complete || img.naturalWidth === 0) return;

  const canvasWidth = elements.canvas.clientWidth;
  const canvasHeight = elements.canvas.clientHeight;

  // Clear canvas with deep luxury black
  ctx.fillStyle = '#060608';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Aspect ratio math (contain mode)
  const imgWidth = img.naturalWidth || 1080;
  const imgHeight = img.naturalHeight || 1920;
  const imgAspect = imgWidth / imgHeight;
  const canvasAspect = canvasWidth / canvasHeight;

  let renderWidth, renderHeight, renderX, renderY;

  if (canvasAspect > imgAspect) {
    // Canvas is wider than image: fit height
    renderHeight = canvasHeight;
    renderWidth = renderHeight * imgAspect;
    renderX = (canvasWidth - renderWidth) / 2;
    renderY = 0;
  } else {
    // Canvas is taller than image: fit width
    renderWidth = canvasWidth;
    renderHeight = renderWidth / imgAspect;
    renderX = 0;
    renderY = (canvasHeight - renderHeight) / 2;
  }

  // Draw ambient soft amber glow behind bottle/glass
  const glowRadius = Math.min(renderWidth, renderHeight) * 0.45;
  const radialGlow = ctx.createRadialGradient(
    canvasWidth / 2, canvasHeight / 2, 20,
    canvasWidth / 2, canvasHeight / 2, glowRadius
  );
  radialGlow.addColorStop(0, 'rgba(229, 142, 38, 0.12)');
  radialGlow.addColorStop(1, 'rgba(6, 6, 8, 0)');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw image
  ctx.drawImage(img, renderX, renderY, renderWidth, renderHeight);
}

/**
 * Update Narrative Milestone Cards visibility based on progress
 */
function updateStoryCards(progress) {
  // Milestone 1: 0.08 - 0.26
  toggleCard(elements.storyCards[0], progress >= 0.08 && progress <= 0.26);
  // Milestone 2: 0.32 - 0.50
  toggleCard(elements.storyCards[1], progress >= 0.32 && progress <= 0.50);
  // Milestone 3: 0.56 - 0.74
  toggleCard(elements.storyCards[2], progress >= 0.56 && progress <= 0.74);
  // Milestone 4: 0.80 - 0.96
  toggleCard(elements.storyCards[3], progress >= 0.80 && progress <= 0.96);
}

function toggleCard(card, isActive) {
  if (!card) return;
  if (isActive) {
    card.classList.add('active');
  } else {
    card.classList.remove('active');
  }
}

/**
 * Scroll Physics & Animation Loop (Lerp + rAF)
 */
function updateScrollProgress() {
  if (!elements.pourTrack) return;

  const rect = elements.pourTrack.getBoundingClientRect();
  const trackHeight = elements.pourTrack.offsetHeight;
  const viewportHeight = window.innerHeight;
  
  // Total scrollable distance within the pour track
  const scrollableDistance = trackHeight - viewportHeight;
  const scrollOffset = -rect.top;

  let rawProgress = scrollOffset / scrollableDistance;
  state.targetProgress = Math.max(0, Math.min(1, rawProgress));
  state.targetFrame = state.targetProgress * (TOTAL_FRAMES - 1);

  if (!state.isRendering) {
    state.isRendering = true;
    requestAnimationFrame(renderLoop);
  }
}

/**
 * Main Render Loop with Smooth Interpolation
 */
function renderLoop() {
  // Linear interpolation for Apple-style buttery inertia
  const LERP_FACTOR = 0.12;
  const frameDiff = state.targetFrame - state.currentFrame;

  if (Math.abs(frameDiff) > 0.01) {
    state.currentFrame += frameDiff * LERP_FACTOR;
    state.currentProgress += (state.targetProgress - state.currentProgress) * LERP_FACTOR;
  } else {
    state.currentFrame = state.targetFrame;
    state.currentProgress = state.targetProgress;
    state.isRendering = false;
  }

  const roundedFrame = Math.round(state.currentFrame);
  drawFrame(roundedFrame);

  // Update scrub indicators
  const percentDisplay = Math.round(state.currentProgress * 100);
  if (elements.scrubLineFill) {
    elements.scrubLineFill.style.height = `${percentDisplay}%`;
  }
  if (elements.scrubFrameLabel) {
    elements.scrubFrameLabel.textContent = `FRAME ${String(roundedFrame + 1).padStart(3, '0')} / ${TOTAL_FRAMES}`;
  }
  if (elements.scrubPercentLabel) {
    elements.scrubPercentLabel.textContent = `${percentDisplay}%`;
  }

  // Update story overlay cards
  updateStoryCards(state.currentProgress);

  // Active navigation highlight based on scroll position
  updateActiveNavigation();

  if (state.isRendering) {
    requestAnimationFrame(renderLoop);
  }
}

/**
 * Update Active Navigation State
 */
function updateActiveNavigation() {
  const scrollY = window.scrollY + 200;
  const sections = ['hero', 'pour-experience', 'premium', 'collection', 'special-packages'];

  sections.forEach((id) => {
    const el = document.getElementById(id);
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!el || !link) return;

    const top = el.offsetTop;
    const height = el.offsetHeight;

    if (scrollY >= top && scrollY < top + height) {
      elements.navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

/**
 * Video Player Controls & Intersection Auto-Play
 */
function setupVideoPlayer() {
  const video = elements.premiumVideo;
  if (!video) return;

  // Play / Pause Toggle
  if (elements.videoPlayBtn) {
    elements.videoPlayBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        elements.videoIconPlay.classList.add('hidden');
        elements.videoIconPause.classList.remove('hidden');
      } else {
        video.pause();
        elements.videoIconPlay.classList.remove('hidden');
        elements.videoIconPause.classList.add('hidden');
      }
    });
  }

  // Mute / Unmute Toggle
  if (elements.videoMuteBtn) {
    elements.videoMuteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (video.muted) {
        elements.videoVolMuted.classList.remove('hidden');
        elements.videoVolUnmuted.classList.add('hidden');
      } else {
        elements.videoVolMuted.classList.add('hidden');
        elements.videoVolUnmuted.classList.remove('hidden');
      }
    });
  }

  // Progress Bar
  video.addEventListener('timeupdate', () => {
    if (video.duration && elements.videoProgressBar) {
      const pct = (video.currentTime / video.duration) * 100;
      elements.videoProgressBar.style.width = `${pct}%`;
    }
  });

  // Seek on click
  if (elements.videoTimeTrack) {
    elements.videoTimeTrack.addEventListener('click', (e) => {
      const rect = elements.videoTimeTrack.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const seekTime = (clickX / width) * video.duration;
      video.currentTime = seekTime;
    });
  }

  // Intersection Observer for auto-play when in view
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        video.play().then(() => {
          if (elements.videoIconPlay && elements.videoIconPause) {
            elements.videoIconPlay.classList.add('hidden');
            elements.videoIconPause.classList.remove('hidden');
          }
        }).catch(() => {
          // Autoplay policy prevented playback
        });
      } else {
        video.pause();
        if (elements.videoIconPlay && elements.videoIconPause) {
          elements.videoIconPlay.classList.remove('hidden');
          elements.videoIconPause.classList.add('hidden');
        }
      }
    });
  }, { threshold: 0.35 });

  videoObserver.observe(video);
}

/**
 * Web Audio Ambient Sound Generator (Whiskey Lounge Atmosphere)
 */
function setupAmbientAudio() {
  if (!elements.audioToggleBtn) return;

  elements.audioToggleBtn.addEventListener('click', () => {
    if (!state.audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      state.audioContext = new AudioContext();
    }

    if (state.audioContext.state === 'suspended') {
      state.audioContext.resume();
    }

    state.audioPlaying = !state.audioPlaying;

    if (state.audioPlaying) {
      // Create warm low ambient hum
      const bufferSize = state.audioContext.sampleRate * 2;
      const noiseBuffer = state.audioContext.createBuffer(1, bufferSize, state.audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      state.ambientNode = state.audioContext.createBufferSource();
      state.ambientNode.buffer = noiseBuffer;
      state.ambientNode.loop = true;

      const filter = state.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 320;

      const gain = state.audioContext.createGain();
      gain.gain.setValueAtTime(0.04, state.audioContext.currentTime);

      state.ambientNode.connect(filter);
      filter.connect(gain);
      gain.connect(state.audioContext.destination);

      state.ambientNode.start(0);

      elements.audioIconOff.classList.add('hidden');
      elements.audioIconOn.classList.remove('hidden');
    } else {
      if (state.ambientNode) {
        state.ambientNode.stop();
        state.ambientNode.disconnect();
        state.ambientNode = null;
      }
      elements.audioIconOff.classList.remove('hidden');
      elements.audioIconOn.classList.add('hidden');
    }
  });
}

/**
 * Allocation Inquiry Form Handler
 */
window.handleInquirySubmit = function() {
  const successMsg = document.getElementById('inquiry-success');
  const form = document.getElementById('inquiry-form');
  if (successMsg) {
    successMsg.classList.remove('hidden');
  }
  if (form) {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach((input) => input.setAttribute('disabled', 'true'));
  }
};

/**
 * Initialize Everything on DOM Load
 */
function init() {
  // Resize handler with debounce
  window.addEventListener('resize', () => {
    resizeCanvas();
    updateScrollProgress();
  }, { passive: true });

  // Passive scroll listener
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // Smooth scroll for anchor buttons
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Setup auxiliary components
  setupVideoPlayer();
  setupAmbientAudio();

  // Begin frame preloading
  preloadFrames();

  // Initial calculation
  updateScrollProgress();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
