import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let smoother: ScrollSmoother | null = null;
    
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      try {
        smoother = ScrollSmoother.create({
          smooth: 1,
          effects: true,
          smoothTouch: 0.1,
        });
      } catch (error) {
        console.log('ScrollSmoother not available:', error);
      }
    }

    return () => {
      if (smoother) {
        smoother.kill();
      }
    };
  }, []);

  return <>{children}</>;
}
