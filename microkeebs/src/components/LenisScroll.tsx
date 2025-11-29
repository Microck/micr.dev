import { ReactLenis } from 'lenis/react';
import React from 'react';

interface LenisScrollProps {
  children: React.ReactNode;
}

export function LenisScroll({ children }: LenisScrollProps) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      {children}
    </ReactLenis>
  );
}
