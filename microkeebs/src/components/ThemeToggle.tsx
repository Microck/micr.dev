import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { AnimatedIcon } from './icons';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMousePos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
    setMousePos({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });

    setIsAnimating(true);
    setTimeout(() => {
      toggleTheme();
      setTimeout(() => setIsAnimating(false), 1000);
    }, 500);
  };

  const centerX = (mousePos.x / window.innerWidth) * 100;
  const centerY = (mousePos.y / window.innerHeight) * 100;

  return (
    <>
      {isAnimating && (
        <div 
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{
            background: isDark ? '#a7a495' : '#1c1c1c',
            clipPath: `circle(0% at ${centerX}% ${centerY}%)`,
            animation: 'themeRadialWipe 1s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }}
        />
      )}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 ease-out z-[101] hover:scale-110 active:scale-95 cursor-target ${
          isDark 
            ? 'bg-[#2a2a2a] text-[#a7a495] hover:bg-[#1c1c1c] shadow-black/20' 
            : 'bg-[#b5b3a7] text-[#1c1c1c] hover:bg-[#a7a495] shadow-black/10'
        }`}
        aria-label="Toggle theme"
      >
        <div className={`transition-transform duration-300 ease-out ${isAnimating ? 'rotate-180' : ''}`}>
          {isDark ? <AnimatedIcon name="sun" size={24} /> : <AnimatedIcon name="moon" size={24} />}
        </div>
      </button>

      <style>{`
        @keyframes themeRadialWipe {
          0% {
            clip-path: circle(0% at ${centerX}% ${centerY}%);
          }
          100% {
            clip-path: circle(150% at ${centerX}% ${centerY}%);
          }
        }
      `}</style>
    </>
  );
}