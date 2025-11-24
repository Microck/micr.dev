import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      toggleTheme();
      setTimeout(() => setIsAnimating(false), 800);
    }, 400);
  };

  return (
    <>
      {isAnimating && (
        <div 
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{
            background: isDark ? '#a7a495' : '#1c1c1c',
            clipPath: 'circle(0% at calc(100% - 3.5rem) calc(100% - 3.5rem))',
            animation: 'radialWipe 0.8s ease-out forwards'
          }}
        />
      )}
      <button
        onClick={handleToggle}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 ease-out z-50 hover:scale-110 active:scale-95 ${
          isDark 
            ? 'bg-[#2a2a2a] text-[#a7a495] hover:bg-[#1c1c1c] shadow-black/20' 
            : 'bg-[#b5b3a7] text-[#1c1c1c] hover:bg-[#a7a495] shadow-black/10'
        }`}
        aria-label="Toggle theme"
      >
        <div className={`transition-transform duration-300 ease-out ${isAnimating ? 'rotate-180' : ''}`}>
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </div>
      </button>
    </>
  );
}