import React, { useRef, useEffect, useState } from 'react';

interface ScrollVelocityProps {
  children: string;
  className?: string;
  baseVelocity?: number;
}

export function ScrollVelocity({ children, className = '', baseVelocity = 1 }: ScrollVelocityProps) {
  const [offset, setOffset] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTime.current;
      
      if (timeDelta > 0) {
        const scrollDelta = currentScrollY - lastScrollY.current;
        const newVelocity = (scrollDelta / timeDelta) * 10;
        setVelocity(newVelocity);
      }
      
      lastScrollY.current = currentScrollY;
      lastTime.current = currentTime;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const animate = () => {
      setOffset((prev) => prev + velocity * baseVelocity);
      setVelocity((prev) => prev * 0.9);
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [velocity, baseVelocity]);

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="whitespace-nowrap transition-transform"
        style={{
          transform: `translateX(${offset}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
