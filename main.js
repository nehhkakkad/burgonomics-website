const canvas = document.getElementById('animation-canvas');
const ctx = canvas?.getContext('2d');
const loadingOverlay = document.getElementById('loading');

// Keep the client-requested scroll image-sequence UX.
// Frames live in public/frames/ -> dist/frames/. Use Vite base so it works
// on GitHub Pages project sites (/<repo>/) as well as locally.
const BASE = import.meta.env?.BASE_URL || './';
const basePath = BASE.endsWith('/') ? BASE : `${BASE}/`;
const frameCount = 197;
const currentFrame = (index) =>
  `${basePath}frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

const images = new Array(frameCount).fill(null);
let firstFrameReady = false;
let settledCount = 0;
let ticking = false;

function hideLoader() {
  loadingOverlay?.classList.add('hidden');
}

function setLoaderText(text) {
  if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
    loadingOverlay.textContent = text;
  }
}

function setupCanvasSize() {
  if (!canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
}

// Draw the frame on the canvas (cover fit)
function renderFrame(index) {
  if (!canvas || !ctx) return;
  const safeIndex = Math.max(0, Math.min(frameCount - 1, index));
  const img = images[safeIndex];
  if (!img || !img.complete || !img.naturalWidth) return;

  ctx.fillStyle = '#11130F';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const canvasRatio = canvas.width / canvas.height;
  const imgRatio = img.naturalWidth / img.naturalHeight;

  let drawWidth, drawHeight;
  if (canvasRatio > imgRatio) {
    drawWidth = canvas.width;
    drawHeight = canvas.width / imgRatio;
  } else {
    drawWidth = canvas.height * imgRatio;
    drawHeight = canvas.height;
  }

  const x = (canvas.width - drawWidth) / 2;
  const y = (canvas.height - drawHeight) / 2;
  try {
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
  } catch {
    // ignore transient draw errors (image still decoding)
  }
}

// Calculate scroll progress (0 to 1)
function getScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return 0;
  return Math.max(0, Math.min(1, window.scrollY / maxScroll));
}

function scrollToFrame() {
  ticking = false;
  const progress = getScrollProgress();
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(progress * (frameCount - 1))
  );
  requestAnimationFrame(() => renderFrame(frameIndex));
}

function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(scrollToFrame);
  }
}

function loadOne(i) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    // First frames highest priority
    if (i < 4) img.fetchPriority = 'high';
    img.onload = () => {
      images[i] = img;
      settledCount++;
      if (i === 0 && !firstFrameReady) {
        firstFrameReady = true;
        hideLoader();
        renderFrame(0);
      }
      setLoaderText(`FRIES ARE FRYING... ${Math.round((settledCount / frameCount) * 100)}%`);
      if (settledCount === frameCount) hideLoader();
      resolve(true);
    };
    img.onerror = () => {
      settledCount++;
      // Never trap the user behind the loader because of one missing frame.
      // Reuse nearest loaded frame at render time (renderFrame guards nulls).
      if (i === 0) {
        setLoaderText('FAILED TO LOAD ANIMATION — CONTINUING...');
        setTimeout(hideLoader, 800);
      }
      if (settledCount === frameCount) hideLoader();
      resolve(false);
    };
    img.src = currentFrame(i + 1);
  });
}

// Load first frame immediately, rest in small batches to avoid 197 parallel requests.
async function preloadImages(batchSize = 12) {
  if (!canvas || !ctx) {
    hideLoader();
    return;
  }
  await loadOne(0);
  for (let start = 1; start < frameCount; start += batchSize) {
    const batch = [];
    for (let i = start; i < Math.min(start + batchSize, frameCount); i++) {
      batch.push(loadOne(i));
    }
    await Promise.all(batch);
    // Re-render current scroll position as more frames arrive
    scrollToFrame();
  }
}

let resizeTimer;
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    setupCanvasSize();
    scrollToFrame();
  }, 150);
});

// Safety: never leave the loader stuck (e.g. all frames 404 / offline)
setTimeout(hideLoader, 15000);

// Initialize
setupCanvasSize();
preloadImages();
