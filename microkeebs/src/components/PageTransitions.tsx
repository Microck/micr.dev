import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useTheme } from '../contexts/use-theme';

interface PageTransitionsProps {
  children: React.ReactNode;
  currentPage: string;
}

export function PageTransitions({ children, currentPage }: PageTransitionsProps) {
  const { isDark } = useTheme();
  const barsRef = useRef<HTMLDivElement[]>([]);
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const lastPageRef = useRef<string>(currentPage);

  const runTransition = useCallback((direction: 'left' | 'right', onCover: () => void) => {
    const bars = barsRef.current;
    
    gsap.killTweensOf(bars);

    const fromY = direction === 'right' ? '100%' : '-100%';
    const toYExit = direction === 'right' ? '-100%' : '100%';

    gsap.set(bars, { y: fromY, x: 0 });

    gsap.to(bars, {
      y: '0%',
      duration: 0.5,
      delay: 0.3,
      stagger: 0.05,
      ease: 'power2.inOut',
      onComplete: () => {
        onCover();
        
        gsap.to(bars, {
          y: toYExit,
          duration: 0.4,
          stagger: 0.03,
          ease: 'power2.inOut',
          delay: 0.1,
        });
      },
    });
  }, []);

  useEffect(() => {
    if (currentPage !== lastPageRef.current) {
      const pageOrder = ['builds', 'rankings', 'blog', 'contact'];
      const fromIndex = pageOrder.indexOf(lastPageRef.current);
      const toIndex = pageOrder.indexOf(currentPage);

      if (fromIndex !== -1 && toIndex !== -1 && lastPageRef.current !== '') {
        const direction = fromIndex < toIndex ? 'right' : 'left';
        runTransition(direction, () => {
          setDisplayedChildren(children);
          lastPageRef.current = currentPage;
        });
      } else {
        setDisplayedChildren(children);
        lastPageRef.current = currentPage;
      }
    } else {
      setDisplayedChildren(children);
    }
  }, [currentPage, children, runTransition]);

  return (
    <>
      <div className="fixed inset-0 z-[100] pointer-events-none flex overflow-hidden">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            ref={(el) => { if (el) barsRef.current[i] = el; }}
            className="h-full"
             style={{
               width: '25%',
               backgroundColor: isDark ? '#a7a495' : '#1c1c1c',
               transform: 'translateY(100%)',
             }}
          />
        ))}
      </div>
      {displayedChildren}
    </>
  );
}
