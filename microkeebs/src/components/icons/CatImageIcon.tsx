import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CatImageIconProps {
  className?: string;
  size?: number;
  src?: string;
}

export const CatImageIcon: React.FC<CatImageIconProps> = ({ 
  className = "", 
  size = 128, 
  src = "/microkeebs/cat.png" 
}) => {
  const { isDark } = useTheme();
  
  return (
    <div 
      className={`${className} transition-all duration-300`}
      style={{ 
        width: size, 
        height: size,
        filter: isDark ? 'brightness(0.8) sepia(0.2) hue-rotate(30deg)' : 'brightness(0.9)'
      }}
    >
      <img 
        src={src}
        alt="Cat"
        className="w-full h-full object-cover rounded-lg"
        style={{ 
          filter: isDark ? 'grayscale(0.2) brightness(0.9)' : 'brightness(1)'
        }}
      />
    </div>
  );
};