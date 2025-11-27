import React from 'react';

interface AnimatedSunIconProps {
  size?: number;
  className?: string;
}

export function AnimatedSunIcon({ size = 24, className = '' }: AnimatedSunIconProps) {
  return (
    <img
      src="/microkeebs/public/icons/sun.svg"
      alt="Sun icon"
      width={size}
      height={size}
      className={`sun-icon ${className}`}
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
