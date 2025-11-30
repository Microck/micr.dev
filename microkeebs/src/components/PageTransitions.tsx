import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PageTransitionsProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export function PageTransitions({ children, direction = 'up' }: PageTransitionsProps) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Animate the curtain bars on mount
    if (curtainRef.current) {
      const bars = barsRef.current;

      // Animate bars sliding up (reveal animation)
      const animationConfig = {
        y: '100%',
        duration: 0.8,
        stagger: 0.1,
        ease: 'expo.inOut',
      };

      if (direction === 'left') {
        gsap.fromTo(bars, {
          x: '-100%',
          ...animationConfig,
        });
      } else if (direction === 'right') {
        gsap.fromTo(bars, {
          x: '100%',
          ...animationConfig,
        });
      } else if (direction === 'up') {
        gsap.fromTo(bars, {
          y: '-100%',
          ...animationConfig,
        });
      } else if (direction === 'down') {
        gsap.fromTo(bars, {
          y: '100%',
          ...animationConfig,
        });
      } else {
        gsap.fromTo(bars, animationConfig);
      }

      const onComplete = () => {
        // Hide curtain after animation
        gsap.to(curtainRef.current, {
          opacity: 0,
          pointerEvents: 'none',
          duration: 0.3,
          delay: 0.2,
        });
      };

      gsap.fromTo(bars, animationConfig).eventCallback('onComplete', onComplete);
    }
  }, []);

  return (
    <div>
      {/* Curtain Transition Overlay */}
      <div
        ref={curtainRef}
        className="fixed inset-0 z-50 pointer-events-none flex"
        style={{
          background: 'transparent',
        }}
      >
        {/* 4 bars - 25% width each, 100% height */}
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) barsRef.current[index] = el;
            }}
            className="h-full flex-1 bg-black dark:bg-white"
            style={{
              width: '25%',
            }}
          />
        ))}
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}
