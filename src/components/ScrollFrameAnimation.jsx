import React, { useRef, useEffect, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import './ScrollFrameAnimation.css';

const FloatingText = memo(({ progress, start, end, side, title, subtitle, linkTo, linkText }) => {
  const isActive = progress >= start && progress <= end;

  let opacity = 0;
  let translateY = 50;

  if (isActive) {
    const localProgress = (progress - start) / (end - start);
    if (localProgress < 0.2) {
      opacity = localProgress / 0.2;
      translateY = 50 * (1 - opacity);
    } else if (localProgress > 0.8) {
      opacity = (1 - localProgress) / 0.2;
      translateY = -50 * (1 - opacity);
    } else {
      opacity = 1;
      translateY = 0;
    }
  }

  return (
    <div
      className={`floating-text-block side-${side}`}
      style={{
        opacity,
        transform: `translateY(calc(-50% + ${translateY}px))`,
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
        display: isActive ? 'flex' : 'none'
      }}
    >
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <Link to={linkTo} className="floating-link">{linkText}</Link>
    </div>
  );
});

const BLUR_RADIUS = 20;
const BLUR_BASE_MARGIN = 60; // 3 * sigma headroom so the blur bleed is not clipped
const BLUR_CACHE_MAX = 24;
const INITIAL_PRIORITY_FRAMES = 24; // frames 001-024 cover the first ~70vh
const RELEASE_TIMEOUT_MS = 4000;
const PROGRESS_BUCKET = 0.005;
const PILL_AUTO_HIDE_MS = 15000;
const OVERLAY_REMOVE_MS = 800;

const ScrollFrameAnimation = ({
  framePathPrefix = '/frames/ezgif-frame-',
  frameCount = 196,
  frameExtension = '.jpg',
  scrollHeight = '700vh'
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const overlayTextRef = useRef(null);
  const pillRef = useRef(null);
  const pillTextRef = useRef(null);

  const imagesRef = useRef(null);
  const statusRef = useRef(null);
  const lastDrawnIndexRef = useRef(-1);
  const blurCacheRef = useRef(new Map());
  const loaderRef = useRef(null);
  const scheduleUpdateRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // -------------------------------------------------------------------------
  // Frame loader: chunked queue with a concurrency cap, per-image error
  // handling, and a release gate that never waits for 100%.
  // -------------------------------------------------------------------------
  useEffect(() => {
    const total = frameCount;
    const status = new Array(total).fill('pending');
    const imgs = new Array(total).fill(null);
    statusRef.current = status;
    imagesRef.current = imgs;

    let cancelled = false;
    let released = false;
    let settled = 0; // loaded + failed
    let active = 0;
    let queue = [];
    let releaseTimer = null;
    let pillTimer = null;

    const conn = navigator.connection || navigator.webkitConnection || {};
    const proto = typeof conn.nextHopProtocol === 'string' ? conn.nextHopProtocol : '';
    const concurrency = proto.includes('h2') ? 16 : 6;

    const hidePill = () => {
      clearTimeout(pillTimer);
      pillRef.current?.classList.remove('visible');
    };

    const showPill = () => {
      if (settled >= total) return; // everything already settled: nothing to report
      pillRef.current?.classList.add('visible');
      pillTimer = setTimeout(hidePill, PILL_AUTO_HIDE_MS);
    };

    const release = () => {
      if (released || cancelled) return;
      released = true;
      clearTimeout(releaseTimer);
      setIsLoaded(true); // React adds .hidden -> keeps the existing fade
      setTimeout(() => {
        const overlay = overlayRef.current;
        if (overlay) overlay.style.display = 'none'; // remove after the ~0.8s fade
      }, OVERLAY_REMOVE_MS);
      showPill();
      scheduleUpdateRef.current?.();
    };

    const pump = () => {
      while (!cancelled && active < concurrency && queue.length > 0) {
        const index = queue.shift();
        if (status[index] === 'pending') startFrame(index);
      }
    };

    const settle = (index, img) => {
      if (cancelled) return;
      if (img) {
        imgs[index] = img;
        status[index] = 'ready';
      } else {
        status[index] = 'failed';
      }
      settled += 1;
      active -= 1;
      const text = `FRYING FRIES ${Math.round((settled / total) * 100)} %`;
      if (overlayTextRef.current) overlayTextRef.current.textContent = text;
      if (pillTextRef.current) pillTextRef.current.textContent = text;
      if (index === 0 && img) release(); // frame 001 ready -> release immediately
      if (settled >= total) hidePill(); // complete -> pill auto-hides
      scheduleUpdateRef.current?.();
      pump();
    };

    const startFrame = (index) => {
      status[index] = 'loading';
      active += 1;
      let attempts = 0;
      const attempt = () => {
        if (cancelled) return;
        const img = new Image();
        const finish = (ok) => {
          img.onload = null;
          img.onerror = null;
          img.onabort = null;
          if (cancelled) return;
          if (ok) {
            settle(index, img);
            return;
          }
          if (attempts < 1) {
            attempts += 1;
            setTimeout(attempt, 250); // retry once
            return;
          }
          settle(index, null); // permanently failed
        };
        img.onload = () => finish(true);
        img.onerror = () => finish(false);
        img.onabort = () => finish(false);
        img.src = `${framePathPrefix}${String(index + 1).padStart(3, '0')}${frameExtension}`;
      };
      attempt();
    };

    const rebuildQueue = (targetIndex) => {
      const initial = [];
      const rest = [];
      for (let i = 0; i < total; i++) {
        if (status[i] !== 'pending') continue;
        if (i < INITIAL_PRIORITY_FRAMES) initial.push(i);
        else rest.push(i);
      }
      rest.sort((a, b) => Math.abs(a - targetIndex) - Math.abs(b - targetIndex));
      queue = initial.concat(rest);
      pump();
    };

    loaderRef.current = { resort: rebuildQueue };
    rebuildQueue(0);
    releaseTimer = setTimeout(release, RELEASE_TIMEOUT_MS);

    return () => {
      cancelled = true;
      if (releaseTimer) clearTimeout(releaseTimer);
      if (pillTimer) clearTimeout(pillTimer);
      loaderRef.current = null;
    };
  }, [frameCount, framePathPrefix, frameExtension]);

  // -------------------------------------------------------------------------
  // Scroll: one rAF-coalesced update per animation frame. Draws only when the
  // resolved frame index changes; never clears without a ready source.
  // -------------------------------------------------------------------------
  useEffect(() => {
    let rafId = null;
    let lastBucket = -1;
    let lastTargetIndex = 0;
    let lastDirection = 0;

    const getBlurPatch = (frameIndex, img, blurWidth, blurHeight) => {
      const cache = blurCacheRef.current;
      const cached = cache.get(frameIndex);
      if (cached) {
        cache.delete(frameIndex); // LRU touch
        cache.set(frameIndex, cached);
        return cached;
      }

      // If the frame is upscaled onto the canvas the blur may bleed further in
      // destination space, so grow the headroom with the scale factor.
      const pad = Math.ceil(BLUR_BASE_MARGIN * Math.max(1, blurWidth / (img.width * 0.15)));

      const srcW = img.width * 0.15;
      const srcH = img.height * 0.10;
      const srcX = img.width - srcW;
      const srcY = img.height - srcH;

      const patch = document.createElement('canvas');
      patch.width = Math.max(1, Math.ceil(blurWidth) + pad * 2);
      patch.height = Math.max(1, Math.ceil(blurHeight) + pad * 2);
      const pctx = patch.getContext('2d');
      if (!pctx) return null;
      pctx.filter = `blur(${BLUR_RADIUS}px)`;
      pctx.drawImage(img, srcX, srcY, srcW, srcH, pad, pad, blurWidth, blurHeight);
      pctx.filter = 'none';

      patch.pad = pad;
      cache.set(frameIndex, patch);
      while (cache.size > BLUR_CACHE_MAX) {
        cache.delete(cache.keys().next().value); // evict oldest
      }
      return patch;
    };

    const drawFrame = (frameIndex) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const img = imagesRef.current[frameIndex];
      if (!img) return; // never clearRect without a ready source
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        blurCacheRef.current.clear(); // patch geometry depends on canvas size
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
      }

      // Draw the full frame normally
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      // Blur the bottom right corner (~15% x ~10%) to hide the watermark.
      // The blurred patch is rendered once per frame into an offscreen canvas
      // and cached, so ctx.filter is not paid for on every draw.
      const blurWidth = drawWidth * 0.15;
      const blurHeight = drawHeight * 0.10;
      const blurX = offsetX + drawWidth - blurWidth;
      const blurY = offsetY + drawHeight - blurHeight;
      const patch = getBlurPatch(frameIndex, img, blurWidth, blurHeight);
      if (patch) ctx.drawImage(patch, blurX - patch.pad, blurY - patch.pad);
    };

    const resolveIndex = (targetIndex) => {
      const status = statusRef.current;
      if (!status) return -1;
      if (status[targetIndex] === 'ready') return targetIndex;
      for (let d = 1; d <= 10; d++) {
        const below = targetIndex - d;
        const above = targetIndex + d;
        if (below >= 0 && status[below] === 'ready') return below;
        if (above < frameCount && status[above] === 'ready') return above;
      }
      return -1; // nothing nearby is ready: do nothing (keep lastDrawnIndex)
    };

    const update = () => {
      rafId = null;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const maxScroll = rect.height - window.innerHeight;

      let progress = maxScroll > 0 ? -rect.top / maxScroll : 0;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      const bucketed = Math.round(progress / PROGRESS_BUCKET) * PROGRESS_BUCKET;
      if (bucketed !== lastBucket) {
        lastBucket = bucketed;
        setScrollProgress(bucketed);
      }

      const targetIndex = Math.min(frameCount - 1, Math.floor(progress * frameCount));
      if (targetIndex !== lastTargetIndex) {
        const direction = targetIndex > lastTargetIndex ? 1 : -1;
        if (direction !== lastDirection) {
          lastDirection = direction;
          loaderRef.current?.resort(targetIndex);
        }
        lastTargetIndex = targetIndex;
      }

      const resolvedIndex = resolveIndex(targetIndex);
      if (resolvedIndex !== -1 && resolvedIndex !== lastDrawnIndexRef.current) {
        drawFrame(resolvedIndex);
        lastDrawnIndexRef.current = resolvedIndex;
      }
    };

    const scheduleUpdate = () => {
      if (rafId === null) rafId = requestAnimationFrame(update);
    };
    scheduleUpdateRef.current = scheduleUpdate;

    const handleResize = () => {
      lastDrawnIndexRef.current = -1; // canvas backing store changed: force redraw
      scheduleUpdate();
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', handleResize);
    scheduleUpdate();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', handleResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
      scheduleUpdateRef.current = null;
    };
  }, [frameCount]);

  return (
    <div className="scroll-animation-container" style={{ height: scrollHeight }} ref={containerRef}>
      <div className="sticky-viewport">

        {/* Loading Overlay: released when frame 001 is ready or after 4 s */}
        <div
          className={`loading-overlay${isLoaded ? ' hidden' : ''}`}
          ref={overlayRef}
          aria-hidden={isLoaded}
        >
          <div className="loading-spinner"></div>
          <p ref={overlayTextRef}>FRYING FRIES 0 %</p>
        </div>

        {/* Non-blocking progress pill shown after release */}
        <div className="load-progress-pill" ref={pillRef} aria-live="polite">
          <span ref={pillTextRef}>FRYING FRIES 0 %</span>
        </div>

        {/* Temporary First Frame Text */}
        <div
          className="hero-content-centered"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 15),
            pointerEvents: scrollProgress > 0.05 ? 'none' : 'auto'
          }}
        >
          <h1>THE HOUSE OF DAMN GOOD BURGERS</h1>
          <Link to="/franchise" className="hero-cta-button">FRANCHISE WITH US</Link>
          <div className="hero-tags">
            <span>FARM-FRESH PRODUCE</span>
            <span className="dot">•</span>
            <span>100% VEGETARIAN</span>
            <span className="dot">•</span>
            <span>ARTISAN BUNS</span>
          </div>
        </div>

        <canvas ref={canvasRef} className="animation-canvas"></canvas>

        {/* Floating Texts */}
        <FloatingText
          progress={scrollProgress} start={0.15} end={0.38} side="left"
          title="THE MENU" subtitle="Premium ingredients. Unmatched flavor. Discover our full range of damn good burgers." linkTo="/menu" linkText="EXPLORE MENU"
        />
        <FloatingText
          progress={scrollProgress} start={0.42} end={0.65} side="right"
          title="LOCATIONS" subtitle="Find the closest Burgonomics to satisfy your cravings. We're growing fast." linkTo="/locations" linkText="FIND A STORE"
        />
        <FloatingText
          progress={scrollProgress} start={0.69} end={0.92} side="left"
          title="THE MINDS BEHIND" subtitle="Meet the visionary team turning simple ingredients into a culinary obsession." linkTo="/about" linkText="ABOUT US"
        />


        {/* Scroll Indicator */}
        <div className="scroll-indicator" style={{ opacity: scrollProgress > 0.05 ? 0 : 1 }}>
          <span className="scroll-text">SCROLL TO EXPLORE</span>
          <div className="scroll-line">
            <div className="scroll-progress"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScrollFrameAnimation;
