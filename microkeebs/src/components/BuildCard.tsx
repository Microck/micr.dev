import React from 'react';
import { KeyboardBuild } from '../types/Build';
import { useTheme } from '../contexts/ThemeContext';

interface BuildCardProps {
  build: KeyboardBuild;
  onClick: () => void;
}

export function BuildCard({ build, onClick }: BuildCardProps) {
  const { isDark } = useTheme();
  
  // Use the first image as the cover image
  const coverImage = build.images[0];

  return (
    <div
      onClick={onClick}
      className="cursor-pointer card-hover"
    >
      {/* Cover image */}
      <div className="w-full h-64 mb-4 overflow-hidden rounded-lg">
        <img
          src={coverImage}
          alt={build.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const placeholder = target.nextElementSibling as HTMLElement;
            if (placeholder) placeholder.style.display = 'flex';
          }}
        />
        {/* Fallback placeholder */}
        <div className="placeholder-bg w-full h-full hidden items-center justify-center">
          <span className={`text-lg font-normal ${isDark ? 'text-[#1c1c1c]' : 'text-[#1c1c1c]'}`}>
            COVER IMAGE
          </span>
        </div>
      </div>
      
      {/* Title */}
      <h3 className={`card-title text-lg text-center slide-up ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>
        {build.title}
      </h3>
    </div>
  );
}