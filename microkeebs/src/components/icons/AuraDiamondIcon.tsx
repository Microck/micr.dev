import React from 'react';

interface AuraDiamondIconProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export const AuraDiamondIcon: React.FC<AuraDiamondIconProps> = ({ 
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
      className={`${className} ${animated ? 'icon-spin' : ''}`}
    >
      <path d="M6 3h12l4 6-10 12L2 9z M12 21l8-10H4z M12 21l-8-10h16z M6 3l2 6h8l2-6z"/>
    </svg>
  );
};