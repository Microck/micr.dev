import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function AuraBackground() {
  const { isDark } = useTheme();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 5,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient overlay */}
      <div 
        className={`absolute inset-0 opacity-30 gradient-shift`}
        style={{
          background: isDark 
            ? 'linear-gradient(-45deg, #1c1c1c, #2a2a2a, #a7a495, #1c1c1c)'
            : 'linear-gradient(-45deg, #a7a495, #b5b3a7, #1c1c1c, #a7a495)'
        }}
      />
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full aura-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: isDark ? '#a7a495' : '#1c1c1c',
            opacity: 0.3,
            animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite, aura-pulse 3s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Orbital rings */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-current opacity-5 aura-rotate" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full border border-current opacity-5 aura-rotate" style={{ animationDirection: 'reverse' }} />
      
      {/* Corner sparkles */}
      <div className="absolute top-8 left-8 icon-float opacity-20">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <div className="absolute top-8 right-8 icon-float opacity-20" style={{ animationDelay: '1s' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <div className="absolute bottom-8 left-8 icon-float opacity-20" style={{ animationDelay: '2s' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <div className="absolute bottom-8 right-8 icon-float opacity-20" style={{ animationDelay: '3s' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
    </div>
  );
}