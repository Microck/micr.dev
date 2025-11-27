import React from 'react';

interface AnimatedSearchIconProps {
  size?: number;
  className?: string;
}

export function AnimatedSearchIcon({ size = 24, className = '' }: AnimatedSearchIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes searchPulse {
            0%, 100% { 
              transform: scale(1);
              opacity: 1;
            }
            50% { 
              transform: scale(1.05);
              opacity: 0.8;
            }
          }
          @keyframes searchRotate {
            0% { transform: rotate(-45deg); }
            100% { transform: rotate(45deg); }
          }
          .search-circle {
            animation: searchPulse 2s ease-in-out infinite;
            transform-origin: center;
          }
          .search-handle {
            animation: searchRotate 3s ease-in-out infinite alternate;
            transform-origin: 17px 17px;
          }
          @media (prefers-reduced-motion: reduce) {
            .search-circle, .search-handle {
              animation: none;
            }
          }
        `}
      </style>
      
      {/* Search circle */}
      <circle
        className="search-circle"
        cx="11"
        cy="11"
        r="8"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Search handle */}
      <path
        className="search-handle"
        d="M21 21L16.65 16.65"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}