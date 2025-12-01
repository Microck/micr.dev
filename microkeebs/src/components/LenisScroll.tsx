import { ReactLenis } from 'lenis/react';
import React from 'react';

interface LenisScrollProps {
  children: React.ReactNode;
}

export function LenisScroll({ children }: LenisScrollProps) {
  return (
    <ReactLenis
      rootOptions={{
        lerp: 0.1,
        duration: 1.5,
        // Custom easing for smooth feel
        easing: (t) => Math.min(1, Math.max(0, 1 - t)),
        // Touch momentum for better mobile experience
        syncTouch: true,
        syncTouchLerp: 0.05,
        // Wheel settings for smooth desktop scrolling
        wheelMultiplier: 1.5,
        // Performance optimization
        normalizeWheelDeltaCause: true,
        reduceMotion: prefersReducedMotion
      }}
    >
      {children}
    </ReactLenis>
  );
}
