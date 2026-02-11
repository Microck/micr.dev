// TEMPORARILY DISABLED FOR PERFORMANCE TESTING
// import { ReactLenis, useLenis } from 'lenis/react';
// import { useEffect } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// gsap.registerPlugin(ScrollTrigger);

export function LenisScroll({ children }: { children: React.ReactNode }) {
  // Lenis disabled - just pass through children
  return <>{children}</>;
  
  /* ORIGINAL CODE - re-enable after testing
  const lenis = useLenis();
  
  useEffect(() => {
    if (!lenis) return;
    
    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);
    
    return () => {
      gsap.ticker.remove(lenis.raf);
    };
  }, [lenis]);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.5,
        smoothWheel: true,
        syncTouch: true,
      }}
    >
      {children}
    </ReactLenis>
  );
  */
}
