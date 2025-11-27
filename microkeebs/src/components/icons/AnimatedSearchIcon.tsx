import React from 'react';

interface AnimatedSearchIconProps {
  size?: number;
  className?: string;
}

export function AnimatedSearchIcon({ size = 24, className = '' }: AnimatedSearchIconProps) {
  return (
    <img
      src="/microkeebs/public/icons/search.svg"
      alt="Search icon"
      width={size}
      height={size}
      className={`search-icon ${className}`}
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
