import React from 'react';

interface AuraRocketIconProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export const AuraRocketIcon: React.FC<AuraRocketIconProps> = ({ 
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
      <path d="M12 2C12 2 7 6 7 12C7 14.5 8.5 16.5 10.5 17.5L9 19L11 21L13 19L11.5 17.5C13.5 16.5 15 14.5 15 12C15 6 12 2 12 2Z"/>
      <circle cx="12" cy="10" r="1.5" fill="currentColor" opacity="0.7"/>
    </svg>
  );
};