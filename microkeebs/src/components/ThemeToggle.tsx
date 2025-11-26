import React, { useState, useRef } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import gsap from 'gsap';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Instant theme swap for reduced motion
      toggleTheme();
      return;
    }

    if (isAnimating) return;

    const button = e.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setIsAnimating(true);

    // Get the container element to clone
    const container = document.querySelector('.microkeebs-container');
    if (!container) {
      toggleTheme();
      setIsAnimating(false);
      return;
    }

    // Capture current scroll position
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999;
      pointer-events: none;
      overflow: hidden;
    `;

    // Clone the container
    const clone = container.cloneNode(true) as HTMLElement;

    // Create a theme wrapper that mimics the root element with theme
    const themeWrapper = document.createElement('div');
    themeWrapper.style.cssText = `
      position: absolute;
      top: -${scrollY}px;
      left: -${scrollX}px;
      width: ${document.documentElement.scrollWidth}px;
      min-height: ${document.documentElement.scrollHeight}px;
      background-color: ${isDark ? '#a7a495' : '#1c1c1c'};
      color: ${isDark ? '#1c1c1c' : '#a7a495'};
    `;
    
    // Apply the new theme class to wrapper (opposite of current)
    themeWrapper.setAttribute('data-theme', isDark ? 'light' : 'dark');
    if (!isDark) {
      themeWrapper.classList.add('dark');
    }

    themeWrapper.appendChild(clone);

    // Create wrapper with clip-path
    const clipWrapper = document.createElement('div');
    clipWrapper.style.cssText = `
      position: absolute;
      inset: 0;
      overflow: hidden;
    `;

    clipWrapper.appendChild(themeWrapper);
    overlay.appendChild(clipWrapper);
    document.body.appendChild(overlay);

    // Calculate max radius needed to cover entire viewport from button center
    const maxX = Math.max(centerX, window.innerWidth - centerX);
    const maxY = Math.max(centerY, window.innerHeight - centerY);
    const maxRadius = Math.sqrt(maxX * maxX + maxY * maxY);

    // Animate the clip-path using GSAP
    gsap.fromTo(
      clipWrapper,
      {
        clipPath: `circle(0rem at ${centerX}px ${centerY}px)`,
      },
      {
        clipPath: `circle(${maxRadius * 1.5}px at ${centerX}px ${centerY}px)`,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: function() {
          // Mid-animation: swap the actual theme
          if (this.progress() > 0.5 && this.progress() < 0.51) {
            toggleTheme();
          }
        },
        onComplete: () => {
          // Clean up
          document.body.removeChild(overlay);
          setIsAnimating(false);
          
          // Restore scroll position
          window.scrollTo(scrollX, scrollY);
        },
      }
    );
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      disabled={isAnimating}
      className={`fixed bottom-6 left-6 p-4 shadow-lg transition-all duration-300 ease-out z-[101] hover:scale-110 active:scale-95 cursor-target ${
        isDark 
          ? 'bg-[#2a2a2a] text-[#a7a495] hover:bg-[#1c1c1c] shadow-black/20' 
          : 'bg-[#b5b3a7] text-[#1c1c1c] hover:bg-[#a7a495] shadow-black/10'
      } ${isAnimating ? 'opacity-75 cursor-not-allowed' : ''}`}
      aria-label="Toggle theme"
    >
      <div className={`transition-transform duration-300 ease-out ${isAnimating ? 'rotate-180' : ''}`}>
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </div>
    </button>
  );
}
