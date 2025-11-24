import React from 'react';

interface ShinyTextProps {
  children: React.ReactNode;
  className?: string;
}

export function ShinyText({ children, className = '' }: ShinyTextProps) {
  return (
    <span className={`relative inline-block shiny-text ${className}`}>
      {children}
    </span>
  );
}
