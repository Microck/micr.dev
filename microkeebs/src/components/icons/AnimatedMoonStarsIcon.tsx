import React from 'react';

interface AnimatedMoonStarsIconProps {
  size?: number;
  className?: string;
}

export function AnimatedMoonStarsIcon({ size = 24, className = '' }: AnimatedMoonStarsIconProps) {
  return (
    <img
      src="/microkeebs/public/icons/icons8-moon-and-stars.gif"
      alt="Moon and stars icon"
      width={size}
      height={size}
      className={`moon-stars-icon ${className}`}
      style={{
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    />
  );
}
