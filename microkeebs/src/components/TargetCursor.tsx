import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useTheme } from '../contexts/ThemeContext';

export function TargetCursor() {
  const { isDark } = useTheme();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check for mobile/touch device
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // GSAP quickTo for 60fps cursor following
    const xTo = gsap.quickTo(cursorRef.current, 'x', { duration: 0.3, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursorRef.current, 'y', { duration: 0.3, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX - 20); // Center the 40px cursor
      yTo(e.clientY - 20);

      // Check for interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, .cursor-target, [role="button"]');
      setIsHovering(!!isInteractive);
    };

    const handleMouseLeave = () => {
      gsap.to(cursorRef.current, { opacity: 0, duration: 0.2 });
    };

    const handleMouseEnter = () => {
      gsap.to(cursorRef.current, { opacity: 1, duration: 0.2 });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isMobile]);

  if (isMobile) return null;

  const color = isDark ? '#a7a495' : '#1c1c1c';

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{ width: 40, height: 40 }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        style={{
          transform: isHovering ? 'scale(1.5) rotate(45deg)' : 'scale(1) rotate(0deg)',
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* Target crosshair */}
        <line x1="20" y1="0" x2="20" y2="12" stroke={color} strokeWidth="2" />
        <line x1="20" y1="28" x2="20" y2="40" stroke={color} strokeWidth="2" />
        <line x1="0" y1="20" x2="12" y2="20" stroke={color} strokeWidth="2" />
        <line x1="28" y1="20" x2="40" y2="20" stroke={color} strokeWidth="2" />
        {/* Center dot */}
        <circle cx="20" cy="20" r="3" fill={color} />
      </svg>
    </div>
  );
}
