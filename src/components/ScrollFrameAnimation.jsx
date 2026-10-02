import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ScrollFrameAnimation.css';

const FloatingText = ({ progress, start, end, side, title, subtitle, linkTo, linkText }) => {
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
};

const ScrollFrameAnimation = ({
  framePathPrefix = '/frames/ezgif-frame-',
  frameCount = 197,
  frameExtension = '.jpg',
  scrollHeight = '700vh'
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const requestRef = useRef();

  // Load images
  useEffect(() => {
    let loadedCount = 0;
    const imgArray = new Array(frameCount);
    let isCancelled = false;
    
    const preloadFirst = new Image();
    preloadFirst.src = `${framePathPrefix}001${frameExtension}`;
    preloadFirst.onload = () => {
      if (isCancelled) return;
      imgArray[0] = preloadFirst;
      loadedCount++;
      setLoadedFrames(loadedCount);
      
      for (let i = 2; i <= frameCount; i++) {
        const img = new Image();
        const paddedIndex = i.toString().padStart(3, '0');
        img.src = `${framePathPrefix}${paddedIndex}${frameExtension}`;
        
        img.onload = () => {
          if (isCancelled) return;
          imgArray[i - 1] = img;
          loadedCount++;
          setLoadedFrames(loadedCount);
          if (loadedCount === frameCount) {
            setIsLoaded(true);
            setImages(imgArray);
          }
        };
      }
    };

    return () => {
      isCancelled = true;
    };
  }, [frameCount, framePathPrefix, frameExtension]);

  useEffect(() => {
    if (images[0]) drawFrame(0);
  }, [images[0]]);

  const drawFrame = (frameIndex) => {
    if (!images[frameIndex] || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = images[frameIndex];
    
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
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
    
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useEffect(() => {
    if (!isLoaded && loadedFrames === 0) return;
    
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const maxScroll = rect.height - window.innerHeight;
      
      let progress = -rect.top / maxScroll;
      
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;
      
      setScrollProgress(progress);
      
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(progress * frameCount)
      );
      
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isLoaded, loadedFrames, frameCount]);

  return (
    <div className="scroll-animation-container" style={{ height: scrollHeight }} ref={containerRef}>
      <div className="sticky-viewport">
        
        {/* Loading Overlay */}
        {!isLoaded && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading Cinematic Experience {Math.round((loadedFrames / frameCount) * 100)}%</p>
          </div>
        )}
        
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
