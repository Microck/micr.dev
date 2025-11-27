import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
}

interface ScrollSmootherType {
  scrollTop: (value: number) => void;
  kill: () => void;
  paused: (value?: boolean) => boolean | void;
}

interface ScrollSmootherConfig {
  wrapper: HTMLElement | null;
  content: HTMLElement | null;
  smooth: number;
  effects: boolean;
  smoothTouch: number | boolean;
  normalizeScroll: boolean;
  ignoreMobileResize: boolean;
}

declare global {
  interface Window {
    ScrollSmoother?: {
      create: (config: ScrollSmootherConfig) => ScrollSmootherType;
    };
  }
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const smootherRef = useRef<ScrollSmootherType | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.innerWidth > 768;

    if (prefersReducedMotion || !isDesktop) {
      return;
    }

    let scriptElement: HTMLScriptElement | null = null;

    const loadScrollSmoother = async () => {
      if (window.ScrollSmoother) {
        setIsLoaded(true);
        return;
      }

      try {
        scriptElement = document.createElement('script');
        scriptElement.src = 'https://assets.codepen.io/16327/ScrollSmoother.min.js';
        scriptElement.async = true;
        
        scriptElement.onload = () => {
          if (window.ScrollSmoother) {
            setIsLoaded(true);
          } else {
            setLoadError(true);
          }
        };
        
        scriptElement.onerror = () => {
          setLoadError(true);
        };
        
        document.head.appendChild(scriptElement);
      } catch (error) {
        console.warn('Failed to load ScrollSmoother:', error);
        setLoadError(true);
      }
    };

    loadScrollSmoother();

    return () => {
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || loadError || !window.ScrollSmoother) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.innerWidth > 768;

    if (prefersReducedMotion || !isDesktop) {
      return;
    }

    try {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      smootherRef.current = window.ScrollSmoother.create({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        smooth: isTouchDevice ? 0.5 : 1.5,
        effects: true,
        smoothTouch: isTouchDevice ? 0.1 : false,
        normalizeScroll: false,
        ignoreMobileResize: true,
      });

      const handleResize = () => {
        if (window.innerWidth <= 768 && smootherRef.current) {
          smootherRef.current.kill();
          smootherRef.current = null;
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (smootherRef.current) {
          try {
            smootherRef.current.kill();
            smootherRef.current = null;
          } catch (error) {
            console.warn('Error killing ScrollSmoother:', error);
          }
        }
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    } catch (error) {
      console.warn('Error initializing ScrollSmoother:', error);
      setLoadError(true);
    }
  }, [isLoaded, loadError]);

  useEffect(() => {
    const handleHashChange = () => {
      if (smootherRef.current && window.location.hash !== '#/builds' && window.location.hash !== '') {
        try {
          smootherRef.current.scrollTop(0);
        } catch {
          window.scrollTo(0, 0);
        }
      } else if (!smootherRef.current) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth > 768 : true;

  if (prefersReducedMotion || !isDesktop || loadError) {
    return <>{children}</>;
  }

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
