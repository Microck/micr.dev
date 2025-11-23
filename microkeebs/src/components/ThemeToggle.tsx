import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { AuraSparkleIcon } from './icons';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-400 aura-morph z-50 aura-glow ${
        isDark 
          ? 'bg-[#2a2a2a] text-[#a7a495] hover:bg-[#1c1c1c] shadow-black/20' 
          : 'bg-[#b5b3a7] text-[#1c1c1c] hover:bg-[#a7a495] shadow-black/10'
      }`}
      aria-label="Toggle theme"
    >
      <div className="relative">
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
        <div className="absolute -top-1 -right-1">
          <AuraSparkleIcon size={8} />
        </div>
      </div>
    </button>
  );
}