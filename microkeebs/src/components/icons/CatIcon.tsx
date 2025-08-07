import React from 'react';

interface CatIconProps {
  className?: string;
  size?: number;
}

export const CatIcon: React.FC<CatIconProps> = ({ className = "", size = 128 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      className={className}
      fill="currentColor"
    >
      {/* Cat head */}
      <circle cx="64" cy="64" r="45" fill="currentColor" />
      
      {/* Ears */}
      <path d="M 35 35 L 45 15 L 55 35 Z" fill="currentColor" />
      <path d="M 73 35 L 83 15 L 93 35 Z" fill="currentColor" />
      
      {/* Eyes */}
      <circle cx="50" cy="55" r="8" fill="#ffffff" />
      <circle cx="78" cy="55" r="8" fill="#ffffff" />
      
      {/* Pupils */}
      <circle cx="50" cy="55" r="4" fill="currentColor" />
      <circle cx="78" cy="55" r="4" fill="currentColor" />
      
      {/* Nose */}
      <path d="M 60 70 L 64 75 L 68 70 Z" fill="#ffffff" />
      
      {/* Mouth */}
      <path d="M 55 80 Q 64 85 73 80" stroke="currentColor" strokeWidth="2" fill="none" />
      
      {/* Whiskers */}
      <line x1="20" y1="65" x2="45" y2="70" stroke="currentColor" strokeWidth="2" />
      <line x1="20" y1="75" x2="45" y2="75" stroke="currentColor" strokeWidth="2" />
      <line x1="83" y1="70" x2="108" y2="65" stroke="currentColor" strokeWidth="2" />
      <line x1="83" y1="75" x2="108" y2="80" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};