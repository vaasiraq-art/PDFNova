import { useState, useEffect, useRef } from 'react';

interface PageFlipAnimationProps {
  children: React.ReactNode;
  currentPage: number;
  previousPage: number;
  enabled: boolean;
  darkMode: boolean;
}

export default function PageFlipAnimation({
  children,
  currentPage,
  previousPage,
  enabled,
  darkMode,
}: PageFlipAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [flipProgress, setFlipProgress] = useState(0);
  const [showNewPage, setShowNewPage] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const prevPageRef = useRef(currentPage);

  useEffect(() => {
    if (!enabled || currentPage === prevPageRef.current) {
      prevPageRef.current = currentPage;
      return;
    }

    const direction = currentPage > prevPageRef.current ? 'next' : 'prev';
    setFlipDirection(direction);
    setIsAnimating(true);
    setShowNewPage(false);
    setFlipProgress(0);

    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Custom easing - fast start, slow middle, fast end (like real paper)
      let eased: number;
      if (progress < 0.3) {
        eased = progress / 0.3 * 0.2; // Quick start
      } else if (progress < 0.7) {
        eased = 0.2 + (progress - 0.3) / 0.4 * 0.6; // Slow middle
      } else {
        eased = 0.8 + (progress - 0.7) / 0.3 * 0.2; // Quick end
      }

      setFlipProgress(eased);

      // Show new page at midpoint
      if (progress >= 0.5 && !showNewPage) {
        setShowNewPage(true);
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setFlipProgress(0);
        setFlipDirection(null);
        setShowNewPage(false);
        prevPageRef.current = currentPage;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentPage, enabled]);

  if (!enabled || !isAnimating || !flipDirection) {
    return <div className="page-container relative">{children}</div>;
  }

  // Calculate rotation (0 to 180 degrees)
  const maxRotation = 180;
  const rotation = flipProgress * maxRotation;

  // Dynamic effects based on progress
  const shadowIntensity = Math.sin(flipProgress * Math.PI);
  const pageLift = Math.sin(flipProgress * Math.PI) * 20; // Page lifts in middle of flip
  const curlAmount = Math.sin(flipProgress * Math.PI) * 15; // Page curl effect

  return (
    <div className="page-container relative" style={{ perspective: '2500px' }}>
      {/* Book spine shadow */}
      <div
        className="absolute top-0 bottom-0 z-30 pointer-events-none"
        style={{
          width: '40px',
          [flipDirection === 'next' ? 'left' : 'right']: '-20px',
          background: `linear-gradient(${flipDirection === 'next' ? 'to right' : 'to left'}, 
            transparent 0%, 
            rgba(0, 0, 0, ${shadowIntensity * 0.3}) 50%, 
            transparent 100%)`,
          opacity: shadowIntensity,
        }}
      />

      {/* Flipping page */}
      <div
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
          transform: `
            rotateY(${flipDirection === 'next' ? -rotation : rotation}deg)
            translateZ(${pageLift}px)
          `,
          transition: 'none',
        }}
      >
        {/* Front of flipping page */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            position: 'relative',
            boxShadow: `
              ${flipDirection === 'next' ? '-' : ''}${shadowIntensity * 30}px 0 ${shadowIntensity * 50}px rgba(0,0,0,${shadowIntensity * 0.4}),
              0 ${shadowIntensity * 10}px ${shadowIntensity * 30}px rgba(0,0,0,${shadowIntensity * 0.2})
            `,
          }}
        >
          {children}

          {/* Page curl gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(${flipDirection === 'next' ? 'to left' : 'to right'}, 
                transparent 0%, 
                rgba(0, 0, 0, ${curlAmount * 0.01}) 70%, 
                rgba(0, 0, 0, ${curlAmount * 0.02}) 100%)`,
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Back of flipping page (visible when turned past 90°) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: darkMode
              ? 'linear-gradient(135deg, #1f2937 0%, #374151 30%, #1f2937 70%, #111827 100%)'
              : 'linear-gradient(135deg, #fafafa 0%, #f3f4f6 30%, #fafafa 70%, #e5e7eb 100%)',
            boxShadow: `
              ${flipDirection === 'next' ? '' : '-'}${shadowIntensity * 30}px 0 ${shadowIntensity * 50}px rgba(0,0,0,${shadowIntensity * 0.4}),
              0 ${shadowIntensity * 10}px ${shadowIntensity * 30}px rgba(0,0,0,${shadowIntensity * 0.2})
            `,
          }}
        >
          {/* Paper texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 2px,
                ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 4px
              )`,
            }}
          />
          
          {/* Page edge lines */}
          <div
            className="absolute top-0 bottom-0 opacity-20"
            style={{
              width: '1px',
              [flipDirection === 'next' ? 'right' : 'left']: '10px',
              background: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
            }}
          />
        </div>
      </div>

      {/* Surface shadow (cast by the flipping page) */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-40px',
          left: '0',
          right: '0',
          height: '40px',
          background: `radial-gradient(ellipse at ${flipDirection === 'next' ? '30%' : '70%'} 0%, 
            rgba(0, 0, 0, ${shadowIntensity * 0.4}) 0%, 
            transparent 70%)`,
          opacity: shadowIntensity,
        }}
      />

      {/* Page edge highlight (light catching the edge) */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none z-40"
        style={{
          width: '2px',
          [flipDirection === 'next' ? 'left' : 'right']: '0',
          background: `linear-gradient(to bottom, 
            transparent 0%, 
            rgba(255, 255, 255, ${0.8 * (1 - Math.abs(flipProgress - 0.5) * 2)}) 30%,
            rgba(255, 255, 255, ${0.9 * (1 - Math.abs(flipProgress - 0.5) * 2)}) 50%,
            rgba(255, 255, 255, ${0.8 * (1 - Math.abs(flipProgress - 0.5) * 2)}) 70%,
            transparent 100%)`,
          opacity: flipProgress > 0.1 && flipProgress < 0.9 ? 1 : 0,
        }}
      />
    </div>
  );
}
