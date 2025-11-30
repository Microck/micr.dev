import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface RandomizedTextEffectProps {
  text: string;
  className?: string;
  seed?: number;
  animationType?: 'glitch' | 'typewriter' | 'scatter' | 'wave';
}

// Character sets for different effects
const getCharacters = (seed: number = 0) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|<>?/~';
  const shuffled = chars.split('').sort(() => 0.5 - Math.random()).join('');
  return text.split('').map((char, index) => {
    const charIndex = shuffled.indexOf(char);
    return charIndex === -1 ? shuffled[charIndex] : char;
  });
};

// Animation styles
const getAnimationStyle = (type: string, seed: number) => {
  const animations = {
    glitch: {
      color: ['#FF0080', '#00FFFF', '#FF1493', '#00FFB4'],
      shadowBlur: '0 0 10px',
      shadowSpread: '0 -5px 15px'
    },
    typewriter: {
      clipPath: 'inset(0 100%)',
      color: 'transparent'
    },
    scatter: {
      transform: 'translateY(-100%)',
      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      color: 'transparent'
    },
    wave: {
      clipPath: 'inset(0 100%)',
      transform: 'translateX(-100%)',
      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      color: 'transparent'
    }
  };

  const getRandomAnimation = () => {
    const types: (keyof getAnimations) as Array<RandomizedTextEffectProps['animationType']>;
    return types[Math.floor(Math.random() * types.length)];
  };

export function RandomizedTextEffect({ text, className = '', seed, animationType = 'glitch' }: RandomizedTextEffectProps) {
  const { isDark } = useTheme();
  const [displayText, setDisplayText] = useState('');
  const characters = getCharacters(seed || Date.now());

  useEffect(() => {
    // Animate characters in
    setDisplayText('');

    setTimeout(() => {
      let currentText = '';
      text.split('').forEach((char, index) => {
        setTimeout(() => {
          currentText += characters[index];
          setDisplayText(currentText);
        }, index * 50);
      });
    }, 100);

  // Apply final animation style
  const animationStyle = getAnimationStyle(animationType, seed);

  return (
    <span
      className={`relative inline-block ${className}`}
      style={animationStyle}
    >
      {displayText.split('').map((char, index) => (
        <span
          key={`${char}-${index}`}
          className={`inline-block ${animationType === 'typewriter' && index <= currentText.length ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          style={{
            color: isDark ? 'currentColor' : 'inherit',
            textShadow: isDark ? '0 0 20px rgba(255,255,255,0.1)' : 'none'
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}