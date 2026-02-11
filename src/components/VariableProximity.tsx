import { useEffect, useRef, useState } from 'react';

interface VariableProximityProps {
  text: string;
  className?: string;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  minWeight?: number;
  maxWeight?: number;
  minOpSize?: number;
  maxOpSize?: number;
}

export function VariableProximity({
  text,
  className = '',
  radius = 150,
  falloff = 'exponential',
  minWeight = 300,
  maxWeight = 900,
  minOpSize = 8,
  maxOpSize = 24,
}: VariableProximityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const letters = text.split('');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
      setIsActive(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      setMousePos({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
      setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const calculateInfluence = (distance: number): number => {
    if (distance > radius) return 0;

    const normalizedDistance = distance / radius;

    switch (falloff) {
      case 'linear':
        return 1 - normalizedDistance;
      case 'exponential':
        return Math.pow(1 - normalizedDistance, 2);
      case 'gaussian':
        return Math.exp(-Math.pow(normalizedDistance * 2, 2));
      default:
        return 1 - normalizedDistance;
    }
  };

  const getLetterStyle = (index: number) => {
    const letterRef = document.getElementById(`letter-${index}`);
    if (!letterRef || !isActive) {
      return {
        fontVariationSettings: `'wght' ${minWeight}, 'opsz' ${minOpSize}`,
        transition: 'font-variation-settings 0.3s ease-out',
      };
    }

    const rect = letterRef.getBoundingClientRect();
    const letterCenterX = rect.left + rect.width / 2;
    const letterCenterY = rect.top + rect.height / 2;

    const distance = Math.sqrt(
      Math.pow(mousePos.x - letterCenterX, 2) + Math.pow(mousePos.y - letterCenterY, 2)
    );

    const influence = calculateInfluence(distance);
    const weight = minWeight + influence * (maxWeight - minWeight);
    const opSize = minOpSize + influence * (maxOpSize - minOpSize);

    return {
      fontVariationSettings: `'wght' ${weight}, 'opsz' ${opSize}`,
      transition: 'font-variation-settings 0.1s ease-out',
    };
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" style={{ fontFamily: "'Roboto Flex', sans-serif" }}>
        {letters.map((letter, index) => (
          <span
            key={index}
            id={`letter-${index}`}
            style={getLetterStyle(index)}
            className="inline-block"
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </span>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Flex:wght@300..900&display=swap');
      `}</style>
    </div>
  );
}
