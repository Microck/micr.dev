import React from 'react';

interface AnimatedMoonStarsIconProps {
  size?: number;
  className?: string;
}

export function AnimatedMoonStarsIcon({ size = 24, className = '' }: AnimatedMoonStarsIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`moon-stars-icon ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          .moon-stars-icon:hover .star {
            animation: twinkle 1s ease-in-out infinite;
          }
          .moon-stars-icon:hover .star:nth-child(2) {
            animation-delay: 0.3s;
          }
          .moon-stars-icon:hover .star:nth-child(3) {
            animation-delay: 0.6s;
          }
          .moon-stars-icon:hover .moon {
            animation: moonGlow 2s ease-in-out infinite;
          }
          .star {
            transition: all 0.3s ease;
          }
          .moon {
            transition: all 0.3s ease;
          }
          @keyframes twinkle {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(0.8); }
          }
          @keyframes moonGlow {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
          }
          @media (prefers-reduced-motion: reduce) {
            .moon-stars-icon:hover .star, .moon-stars-icon:hover .moon {
              animation: none;
            }
          }
        `}
      </style>
      
      {/* Moon crescent */}
      <path
        className="moon"
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="currentColor"
      />
      
      {/* Stars */}
      <g className="stars">
        {/* Star 1 */}
        <g className="star">
          <path
            d="M2 12L2.5 13.5L4 14L2.5 14.5L2 16L1.5 14.5L0 14L1.5 13.5L2 12Z"
            fill="currentColor"
          />
        </g>
        
        {/* Star 2 */}
        <g className="star">
          <path
            d="M7 6L7.5 7.5L9 8L7.5 8.5L7 10L6.5 8.5L5 8L6.5 7.5L7 6Z"
            fill="currentColor"
          />
        </g>
        
        {/* Star 3 */}
        <g className="star">
          <path
            d="M18 18L18.5 19.5L20 20L18.5 20.5L18 22L17.5 20.5L16 20L17.5 19.5L18 18Z"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  );
}