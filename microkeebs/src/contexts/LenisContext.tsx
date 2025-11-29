import React, { createContext, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface LenisContextType {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextType | undefined>(undefined);

interface LenisProviderProps {
  children: ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const gsapUpdateRef = useRef<((time: number) => void) | null>(null);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !prefersReducedMotion,
      syncTouch: false,
      touchMultiplier: prefersReducedMotion ? 1 : 2,
      wheelMultiplier: 1,
      infinite: false,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
      lenis.scrollTo(parseInt(scrollPosition, 10), { immediate: true });
      sessionStorage.removeItem('scrollPosition');
    }

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsapUpdateRef.current = update;
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (gsapUpdateRef.current) {
        gsap.ticker.remove(gsapUpdateRef.current);
        gsapUpdateRef.current = null;
      }
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (lenisRef.current) {
        sessionStorage.setItem('scrollPosition', lenisRef.current.scroll.toString());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const value = useMemo(() => ({
    lenis: lenisInstance,
  }), [lenisInstance]);

  return (
    <LenisContext.Provider value={value}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenis(): Lenis | null {
  const context = useContext(LenisContext);
  if (context === undefined) {
    throw new Error('useLenis must be used within a LenisProvider');
  }
  return context.lenis;
}
