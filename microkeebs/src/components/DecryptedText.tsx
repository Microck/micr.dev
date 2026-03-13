import { useCallback, useEffect, useState, useRef, useMemo } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  characters?: string;
  className?: string;
  parentClassName?: string;
  animateOn?: 'view' | 'hover';
  delay?: number;
}

export function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  className = '',
  parentClassName = '',
  animateOn = 'view',
  delay = 0,
}: DecryptedTextProps) {
  const chars = useMemo(() => characters.split(''), [characters]);
  
  const scramble = useCallback((revealed: Set<number>) => {
    return text
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (revealed.has(i)) return text[i];
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');
  }, [chars, text]);

  const [displayText, setDisplayText] = useState(() => 
    animateOn === 'view' ? scramble(new Set()) : text
  );
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (animateOn !== 'view') return;
    
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animateOn, started]);

  useEffect(() => {
    if (!started) return;

    const timeoutId = setTimeout(() => {
      let iteration = 0;
      const revealedSet = new Set<number>();

      const getNextIndex = (): number => {
        const len = text.length;
        switch (revealDirection) {
          case 'end':
            return len - 1 - revealedSet.size;
          case 'center': {
            const mid = Math.floor(len / 2);
            const off = Math.floor(revealedSet.size / 2);
            return revealedSet.size % 2 === 0 ? mid + off : mid - off - 1;
          }
          default:
            return revealedSet.size;
        }
      };

      const interval = setInterval(() => {
        if (sequential) {
          if (revealedSet.size < text.length) {
            const idx = getNextIndex();
            if (idx >= 0 && idx < text.length) {
              revealedSet.add(idx);
            }
            setDisplayText(scramble(revealedSet));
          } else {
            clearInterval(interval);
            setDisplayText(text);
          }
        } else {
          iteration++;
          if (iteration >= maxIterations) {
            clearInterval(interval);
            setDisplayText(text);
          } else {
            setDisplayText(scramble(revealedSet));
          }
        }
      }, speed);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [started, text, speed, maxIterations, sequential, revealDirection, delay, scramble]);

  const handleMouseEnter = () => {
    if (animateOn === 'hover') {
      setStarted(true);
    }
  };

  const handleMouseLeave = () => {
    if (animateOn === 'hover') {
      setStarted(false);
      setDisplayText(text);
    }
  };

  return (
    <span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={className}>
        {displayText}
      </span>
    </span>
  );
}
