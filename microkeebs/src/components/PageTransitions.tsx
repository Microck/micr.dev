import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

interface PageTransitionsProps {
  children: React.ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function PageTransitions({ children, currentPage, onNavigate }: PageTransitionsProps) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | 'up' | 'down'>('up');
  const previousPageRef = useRef<string | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine direction based on current and previous page
  const determineDirection = useCallback((from: string | undefined, to: string | undefined): 'left' | 'right' | 'up' | 'down' => {
    const pageOrder = ['builds', 'rankings', 'contact'];

    if (!from || !to) return 'up';

    const fromIndex = pageOrder.indexOf(from);
    const toIndex = pageOrder.indexOf(to);

    if (fromIndex === -1 || toIndex === -1) return 'up';

    if (fromIndex < toIndex) return 'right';
    if (fromIndex > toIndex) return 'left';

    return 'up';
  }, []);

  // Start transition with delay
  const startTransition = useCallback(async (toPage: string) => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Set direction based on navigation
    const direction = determineDirection(previousPageRef.current, toPage);
    setTransitionDirection(direction);

    // Show curtain after delay (simulating page load time)
    timeoutRef.current = setTimeout(() => {
      if (!curtainRef.current) return;

      const bars = barsRef.current.filter((bar): bar is HTMLDivElement => bar !== null);

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

      // Reset bars to initial position
      gsap.set(bars, fromVars);

      // Animate bars in
      const tl = gsap.timeline({
        onComplete: () => {
          // Reverse animation after delay
          setTimeout(() => {
            gsap.to(bars, {
              ...fromVars,
              duration: 0.6,
              stagger: 0.05,
              ease: 'expo.inOut',
              onComplete: () => {
                setIsTransitioning(false);
                if (onNavigate) {
                  onNavigate(toPage);
                }
              }
            });
          }, 300);
        }
      });

      tl.to(bars, toVars);
    }, 300); // 300ms delay before starting transition
  }, [isTransitioning, onNavigate, determineDirection]);

  // Listen for hash changes to trigger transitions
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      let page = 'builds';

      if (hash.startsWith('#/builds/')) {
        page = 'builds';
      } else if (hash === '#/rankings') {
        page = 'rankings';
      } else if (hash === '#/contact') {
        page = 'contact';
      }

      if (page !== previousPageRef.current && page !== 'builds' && !hash.includes('/builds/')) {
        // Only transition between main pages, not to build details
        startTransition(page);
      }

      previousPageRef.current = page;
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [startTransition]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div>
      {/* Curtain Transition Overlay */}
      <div
        ref={curtainRef}
        className={`fixed inset-0 z-50 pointer-events-none flex transition-opacity duration-300 ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
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
            className={`h-full flex-1 bg-black dark:bg-white ${
              isTransitioning ? '' : 'opacity-0'
            }`}
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