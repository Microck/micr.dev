import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface AuraButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function AuraButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false
}: AuraButtonProps) {
  const { isDark } = useTheme();

  const baseClasses = 'relative overflow-hidden transition-all duration-300 font-normal rounded-lg aura-morph';
  
  const variantClasses = {
    primary: isDark 
      ? 'bg-[#a7a495] text-[#1c1c1c] hover:bg-[#b5b3a7] shadow-lg' 
      : 'bg-[#1c1c1c] text-[#a7a495] hover:bg-[#2a2a2a] shadow-lg',
    secondary: isDark 
      ? 'bg-[#2a2a2a] text-[#a7a495] hover:bg-[#1c1c1c] border border-[#a7a495]' 
      : 'bg-[#b5b3a7] text-[#1c1c1c] hover:bg-[#a7a495] border border-[#1c1c1c]',
    ghost: isDark 
      ? 'text-[#a7a495] hover:bg-[#2a2a2a]' 
      : 'text-[#1c1c1c] hover:bg-[#b5b3a7]'
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <div className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </div>
      {/* Shimmer effect */}
      <div className="absolute inset-0 -top-full left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-transform duration-700 group-hover:translate-x-full" />
    </button>
  );
}