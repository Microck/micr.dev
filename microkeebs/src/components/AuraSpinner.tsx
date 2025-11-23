import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { AuraDiamondIcon } from './icons';

interface AuraSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function AuraSpinner({ size = 'medium', className = '' }: AuraSpinnerProps) {
  const { isDark } = useTheme();
  
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-2 border-current border-t-transparent animate-spin`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <AuraDiamondIcon 
            size={size === 'small' ? 8 : size === 'medium' ? 12 : 16} 
            className={isDark ? 'text-[#1c1c1c]' : 'text-[#a7a495]'} 
          />
        </div>
      </div>
    </div>
  );
}