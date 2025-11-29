import React from 'react';

interface AnimatedYoutubeIconProps {
  size?: number;
  className?: string;
}

export function AnimatedYoutubeIcon({ size = 24, className }: AnimatedYoutubeIconProps) {
  return (
    <>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={`animated-youtube-icon ${className || ''}`}
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
      <style>{`
        @keyframes youtube-pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animated-youtube-icon {
          transition: all 0.3s ease-out;
        }

        .animated-youtube-icon:hover {
          animation: youtube-pulse 0.6s ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .animated-youtube-icon:hover {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
