import React from 'react';

interface AuraLightningIconProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export const AuraLightningIcon: React.FC<AuraLightningIconProps> = ({ 
  className = "", 
  size = 24,
  animated = true 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${className} ${animated ? 'aura-bounce-in' : ''}`}
    >
      <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
    </svg>
  );
};