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
  const previousPageRef = useRef<string | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine direction based on current and previous page
  const determineDirection = useCallback((from: string | undefined, to: string | undefined): 'left' | 'right' => {
    const pageOrder = ['builds', 'rankings', 'contact'];

    if (!from || !to) return 'right';

    const fromIndex = pageOrder.indexOf(from);
    const toIndex = pageOrder.indexOf(to);

    if (fromIndex === -1 || toIndex === -1) return 'right';

    if (fromIndex < toIndex) return 'right';
    if (fromIndex > toIndex) return 'left';

    return 'right';
  }, []);

  // Start transition
  const startTransition = useCallback(async (toPage: string) => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Set direction based on navigation
    const direction = determineDirection(previousPageRef.current, toPage);

    const bars = barsRef.current.filter((bar): bar is HTMLDivElement => bar !== null);
    if (bars.length !== 4) return;

    // Define animation properties based on direction
    let fromVars: gsap.TweenVars = {};
    let toVars: gsap.TweenVars = {
      duration: 0.6,
      stagger: 0.05,
      ease: 'power2.inOut',
    };

    if (direction === 'left') {
      fromVars = { x: '-100%' };
      toVars = { ...toVars, x: '0%' };
    } else {
      fromVars = { x: '100%' };
      toVars = { ...toVars, x: '0%' };
    }

    // Reset bars to initial position (invisible)
    gsap.set(bars, {
      ...fromVars,
      opacity: 1
    });

    // Animate bars in to cover screen
    gsap.to(bars, toVars);

    // Reverse animation after covering screen
    timeoutRef.current = setTimeout(() => {
      gsap.to(bars, {
        ...fromVars,
        duration: 0.4,
        stagger: 0.02,
        ease: 'power2.inOut',
        onComplete: () => {
          setIsTransitioning(false);
          // Reset opacity for next transition
          gsap.set(bars, { opacity: 0 });
        }
      });
    }, 400);
  }, [isTransitioning, determineDirection]);

  // Listen for hash changes to trigger transitions
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      let page = 'builds';

      if (hash.startsWith('#/builds/')) {
        page = 'builds'; // Don't transition for build details
      } else if (hash === '#/rankings') {
        page = 'rankings';
      } else if (hash === '#/contact') {
        page = 'contact';
      }

      // Only transition between main pages
      if (page !== previousPageRef.current &&
          !hash.includes('/builds/') &&
          previousPageRef.current !== undefined) {
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
        className={`fixed inset-0 z-50 pointer-events-none flex ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-200`}
      >
        {/* 4 bars - 25% width each, 100% height */}
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) barsRef.current[index] = el;
            }}
            className="h-full bg-black dark:bg-white"
            style={{
              width: '25%',
              opacity: 0, // Start invisible
            }}
          />
        ))}
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}