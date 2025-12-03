import React, { useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from '@iconify/react';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    // Simple theme toggle with smooth CSS transitions
    toggleTheme();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 ease-out z-[101] hover:scale-110 active:scale-95 cursor-target ${
        isDark
          ? 'bg-[#2a2a2a] hover:bg-[#1c1c1c] shadow-black/20'
          : 'bg-[#b5b3a7] hover:bg-[#a7a495] shadow-black/10'
      }`}
      aria-label="Toggle theme"
    >
      {/* Simple theme toggle with MingCute icons */}
      <Icon
        icon={isDark ? "mingcute:sun-line" : "mingcute:moon-line"}
        className={`w-6 h-6 transition-all duration-300 ${
          isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
        }`}
      />
    </button>
  );
}