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
    // Only animate if we have both the curtain container and all bar elements
    if (!curtainRef.current) return;
    
    const bars = barsRef.current.filter((bar): bar is HTMLDivElement => bar !== null);
    
    // Ensure all bars are mounted before animating
    if (bars.length !== 4) return;

    // Define animation properties based on direction
    let fromVars: gsap.TweenVars = {};
    let toVars: gsap.TweenVars = {
      duration: 0.8,
      stagger: 0.1,
      ease: 'expo.inOut',
    };

    if (direction === 'left') {
      fromVars = { x: '-100%' };
      toVars = { ...toVars, x: '0%' };
    } else if (direction === 'right') {
      fromVars = { x: '100%' };
      toVars = { ...toVars, x: '0%' };
    } else if (direction === 'up') {
      fromVars = { y: '-100%' };
      toVars = { ...toVars, y: '0%' };
    } else if (direction === 'down') {
      fromVars = { y: '100%' };
      toVars = { ...toVars, y: '0%' };
    }

    // Perform the animation with proper from/to values
    const tl = gsap.timeline({
      onComplete: () => {
        // Hide curtain after animation completes
        if (curtainRef.current) {
          gsap.to(curtainRef.current, {
            opacity: 0,
            pointerEvents: 'none',
            duration: 0.3,
            delay: 0.2,
          });
        }
      }
    });

    tl.fromTo(bars, fromVars, toVars);
  }, [direction]);

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
