import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} mt-auto`}>
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex flex-col items-center">
          <p className={`text-sm ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>
            ©2025 Microkeebs. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}