import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PageTransitionsProps {
  children: React.ReactNode;
}

export function PageTransitions({ children }: PageTransitionsProps) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Animate the curtain bars on mount
    if (curtainRef.current) {
      const bars = barsRef.current;
      
      // Animate bars sliding up (reveal animation)
      gsap.fromTo(
        bars,
        {
          y: '100%',
        },
        {
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'expo.inOut',
          onComplete: () => {
            // Hide curtain after animation
            gsap.to(curtainRef.current, {
              opacity: 0,
              pointerEvents: 'none',
              duration: 0.3,
              delay: 0.2,
            });
          },
        }
      );
    }
  }, []);

  return (
    <div>
      {/* Curtain Transition Overlay */}
      <div
        ref={curtainRef}
        className="fixed inset-0 z-50 pointer-events-auto flex"
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
