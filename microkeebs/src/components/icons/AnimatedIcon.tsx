import React from 'react';

export interface AnimatedIconProps {
  name: string;
  className?: string;
  size?: number;
  animated?: boolean;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({ 
  name,
  className = "", 
  size = 24,
  animated = true 
}) => {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const shouldAnimate = animated && !prefersReducedMotion;

  const getIconPath = (iconName: string) => {
    switch (iconName) {
      case 'arrow-left':
        return (
          <>
            <path d="M19 12H5M5 12l7 7M5 12l7-7" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none"
              className={shouldAnimate ? 'arrow-slide' : ''}
            />
          </>
        );
      
      case 'youtube':
        return (
          <path 
            d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" 
            fill="currentColor"
            className={shouldAnimate ? 'pulse-glow' : ''}
          />
        );
      
      case 'instagram':
        return (
          <>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
              className={shouldAnimate ? 'pulse-ring' : ''}
            />
            <circle cx="12" cy="12" r="4" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
              className={shouldAnimate ? 'pulse-ring-delayed' : ''}
            />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
          </>
        );
      
      case 'tiktok':
        return (
          <path 
            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.56a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04.01z" 
            fill="currentColor"
            className={shouldAnimate ? 'bounce-gentle' : ''}
          />
        );
      
      case 'search':
        return (
          <>
            <circle cx="11" cy="11" r="8" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
              className={shouldAnimate ? 'rotate-slow' : ''}
            />
            <path d="m21 21-4.35-4.35" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
              className={shouldAnimate ? 'dash-animate' : ''}
            />
          </>
        );
      
      case 'chevron-left':
        return (
          <path 
            d="M15 18l-6-6 6-6" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none"
            className={shouldAnimate ? 'slide-left' : ''}
          />
        );
      
      case 'chevron-right':
        return (
          <path 
            d="M9 18l6-6-6-6" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none"
            className={shouldAnimate ? 'slide-right' : ''}
          />
        );
      
      case 'trophy':
        return (
          <>
            <path 
              d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
            <path 
              d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
            <path 
              d="M4 22h16" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
            <path 
              d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
            <path 
              d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
            <path 
              d="M18 2H6v7a6 6 0 0 0 12 0V2Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
              className={shouldAnimate ? 'shine-sweep' : ''}
            />
          </>
        );
      
      case 'eye':
        return (
          <>
            <path 
              d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
              className={shouldAnimate ? 'scale-pulse' : ''}
            />
            <circle 
              cx="12" 
              cy="12" 
              r="3" 
              stroke="currentColor" 
              strokeWidth="2"
              fill="none"
              className={shouldAnimate ? 'iris-pulse' : ''}
            />
          </>
        );
      
      case 'volume':
        return (
          <>
            <polygon 
              points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
            <path 
              d="M15.54 8.46a5 5 0 0 1 0 7.07" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
              className={shouldAnimate ? 'wave-1' : ''}
            />
            <path 
              d="M19.07 4.93a10 10 0 0 1 0 14.14" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
              className={shouldAnimate ? 'wave-2' : ''}
            />
          </>
        );
      
      case 'hand':
        return (
          <path 
            d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
            className={shouldAnimate ? 'wave-hand' : ''}
          />
        );
      
      case 'close':
        return (
          <>
            <path 
              d="M18 6L6 18" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={shouldAnimate ? 'draw-1' : ''}
            />
            <path 
              d="M6 6l12 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={shouldAnimate ? 'draw-2' : ''}
            />
          </>
        );
      
      case 'monitor':
        return (
          <>
            <rect 
              x="2" 
              y="3" 
              width="20" 
              height="14" 
              rx="2" 
              ry="2" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
              className={shouldAnimate ? 'glow-pulse' : ''}
            />
            <path 
              d="M8 21h8" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M12 17v4" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </>
        );
      
      case 'sun':
        return (
          <>
            <circle 
              cx="12" 
              cy="12" 
              r="4" 
              stroke="currentColor" 
              strokeWidth="2"
              fill="none"
              className={shouldAnimate ? 'rotate-slow' : ''}
            />
            <path 
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
              className={shouldAnimate ? 'rays-rotate' : ''}
            />
          </>
        );
      
      case 'moon':
        return (
          <path 
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
            className={shouldAnimate ? 'glow-moon' : ''}
          />
        );

      default:
        return <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      {getIconPath(name)}
    </svg>
  );
};
