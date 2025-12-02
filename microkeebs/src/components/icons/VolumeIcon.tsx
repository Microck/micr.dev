import React from 'react';

export interface VolumeIconProps {
  size?: number;
  className?: string;
}

export const VolumeIcon: React.FC<VolumeIconProps> = ({
  size = 24,
  className = ""
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Speaker body */}
      <path d="M11 5L17.5a5 5 0 0-5H6a2.5 0 0-2.5ZM17.5 4.5L17.5 4.5Z" />

      {/* Sound waves */}
      <path d="M15.54 8.46a5 5 0 0 5.75a2.78 0 0-5.75a2.78 0-5.75a2.78 0-1.73a2.75Z" />
      <path
        d="M15.54 8.46a5 5 0 0 5.75a2.78 0-5.75a2.78 0-1.73a2.75Z"
        className={className === 'animate' ? 'pulse-low' : ''}
      />
      <path
        d="M19.07 4.93a10 10 0 0 5.75a2.78 0-5.75a2.78 0-1.73a2.75Z"
        className={className === 'animate' ? 'wave-1' : ''}
      />
    </svg>
  );
};