import React from 'react';

interface AnimatedSunIconProps {
  size?: number;
  className?: string;
}

export function AnimatedSunIcon({ size = 24, className = '' }: AnimatedSunIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`sun-icon ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          .sun-icon:hover .sun-rays {
            transform-origin: center;
            animation: sunRotate 2s linear infinite;
          }
          .sun-icon:hover .sun-core {
            animation: sunPulse 1.5s ease-in-out infinite;
          }
          .sun-rays {
            transform-origin: center;
            transition: transform 0.3s ease;
          }
          .sun-core {
            transition: all 0.3s ease;
          }
          @keyframes sunRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes sunPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          @media (prefers-reduced-motion: reduce) {
            .sun-icon:hover .sun-rays, .sun-icon:hover .sun-core {
              animation: none;
            }
          }
        `}
      </style>
      
      {/* Sun rays */}
      <g className="sun-rays">
        {/* Top ray */}
        <path
          d="M12 2V4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Top-right ray */}
        <path
          d="M19 5L17.5 6.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Right ray */}
        <path
          d="M22 12H20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Bottom-right ray */}
        <path
          d="M19 19L17.5 17.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Bottom ray */}
        <path
          d="M12 22V20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Bottom-left ray */}
        <path
          d="M5 19L6.5 17.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Left ray */}
        <path
          d="M2 12H4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Top-left ray */}
        <path
          d="M5 5L6.5 6.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      
      {/* Sun core */}
      <circle
        className="sun-core"
        cx="12"
        cy="12"
        r="5"
        fill="currentColor"
      />
    </svg>
  );
}