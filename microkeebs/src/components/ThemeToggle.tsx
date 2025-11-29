import React, { useRef } from 'react';
import { AnimatedSunIcon, AnimatedMoonStarsIcon } from './icons';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Use View Transition API if available
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        // Store transition origin for CSS animation
        document.documentElement.style.setProperty('--transition-x', `${x}px`);
        document.documentElement.style.setProperty('--transition-y', `${y}px`);
        toggleTheme();
      });
    } else {
      // Fallback for browsers without View Transition API
      toggleTheme();
    }
  };

  return (
    <>
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
        <div className="transition-transform duration-300 ease-out">
          {isDark ? <AnimatedSunIcon size={24} /> : <AnimatedMoonStarsIcon size={24} />}
        </div>
      </button>

      <style>{`
        ::view-transition-old(root) {
          animation: none;
          z-index: -1;
        }

        ::view-transition-new(root) {
          mask: url('/logo.svg') center / 0 no-repeat;
          animation: scale 1s ease-out forwards;
        }

        @keyframes scale {
          to {
            mask-size: 200vmax;
          }
        }
      `}</style>
    </>
  );
}
