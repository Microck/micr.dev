import React, { useEffect, useRef, useState } from 'react';

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
}

export function SplitText({ children, className = '', delay = 0 }: SplitTextProps) {
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

  const words = children.split(' ');

  return (
    <div ref={ref} className={`${className} overflow-hidden`} aria-label={children}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block" aria-hidden="true">
          {word.split('').map((char, charIndex) => (
            <span
              key={charIndex}
              className="inline-block transition-all duration-500 ease-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                transitionDelay: `${(wordIndex * 50 + charIndex * 30)}ms`
              }}
            >
              {char}
            </span>
          ))}
          {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </div>
  );
}
