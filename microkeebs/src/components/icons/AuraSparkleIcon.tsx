import React from 'react';

interface AuraSparkleIconProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export const AuraSparkleIcon: React.FC<AuraSparkleIconProps> = ({ 
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
      className={`${className} ${animated ? 'icon-float' : ''}`}
    >
      <path d="M12 2L9.19 8.62L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2z"/>
      <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.6"/>
    </svg>
  );
};