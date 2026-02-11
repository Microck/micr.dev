import { useEffect, useRef, useState } from 'react';

interface MaskedTextProps {
  children: string;
  className?: string;
  delay?: number;
}

export function MaskedText({ children, className = '', delay = 0 }: MaskedTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        className="transition-all duration-1000 ease-out"
        style={{
          clipPath: isVisible ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
