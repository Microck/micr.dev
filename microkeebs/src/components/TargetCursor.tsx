import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface TargetCursorProps {
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
}

export function TargetCursor({
  spinDuration = 8,
  hideDefaultCursor = true,
  hoverDuration = 0.3,
  parallaxOn = false,
}: TargetCursorProps) {
  const { isDark } = useTheme();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
      const elements = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
      elements.forEach((el) => {
        (el as HTMLElement).style.cursor = 'none';
      });
    }

    const updateCursorPosition = () => {
      if (!cursorRef.current) return;

      const dx = mousePos.current.x - cursorPos.current.x;
      const dy = mousePos.current.y - cursorPos.current.y;

      cursorPos.current.x += dx * 0.15;
      cursorPos.current.y += dy * 0.15;

      cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`;

      animationFrameId.current = requestAnimationFrame(updateCursorPosition);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement;
      const isTargetElement = target.closest('.cursor-target') !== null;
      setIsHovering(isTargetElement);
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
      }
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '1';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    animationFrameId.current = requestAnimationFrame(updateCursorPosition);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      if (hideDefaultCursor) {
        document.body.style.cursor = '';
        const elements = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
        elements.forEach((el) => {
          (el as HTMLElement).style.cursor = '';
        });
      }
    };
  }, [isMobile, hideDefaultCursor]);

  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      className="target-cursor"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '40px',
        height: '40px',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
        transform: 'translate(0, 0)',
        transition: isHovering ? `all ${hoverDuration}s ease-out` : 'none',
      }}
    >
      <div
        className="target-cursor-inner"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          animation: `spin ${spinDuration}s linear infinite`,
          transform: isHovering ? 'scale(1.5)' : 'scale(1)',
          transition: `transform ${hoverDuration}s ease-out`,
        }}
      >
        {/* Top-left corner */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '12px',
            height: '2px',
            backgroundColor: isDark ? '#a7a495' : '#fff',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '2px',
            height: '12px',
            backgroundColor: isDark ? '#a7a495' : '#fff',
          }}
        />

        {/* Top-right corner */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '12px',
            height: '2px',
            backgroundColor: isDark ? '#a7a495' : '#fff',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '2px',
            height: '12px',
            backgroundColor: isDark ? '#a7a495' : '#fff',
          }}
        />

        {/* Bottom-left corner */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '12px',
            height: '2px',
            backgroundColor: isDark ? '#a7a495' : '#fff',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '2px',
            height: '12px',
            backgroundColor: isDark ? '#a7a495' : '#fff',
          }}
        />

        {/* Bottom-right corner */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '12px',
            height: '2px',
            backgroundColor: isDark ? '#a7a495' : '#fff',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '2px',
            height: '12px',
            backgroundColor: isDark ? '#a7a495' : '#fff',
          }}
        />

        {/* Center dot */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '4px',
            height: '4px',
            backgroundColor: isDark ? '#a7a495' : '#fff',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
          }}
        />
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
