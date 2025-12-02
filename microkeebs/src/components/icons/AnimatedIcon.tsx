import React, { forwardRef, useRef, useImperativeHandle, useCallback } from 'react';
import * as LucideIcons from 'lucide-react';
import { GithubIcon } from '@/components/ui/github';
import { YoutubeIcon } from '@/components/ui/youtube';
import { InstagramIcon } from '@/components/ui/instagram';

export interface AnimatedIconProps {
  name: string;
  className?: string;
  size?: number;
  animated?: boolean;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const AnimatedIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(({
  name,
  className = "",
  size = 24,
  animated = true,
  onMouseEnter,
  onMouseLeave,
  ...props
}, ref) => {
  const githubRef = useRef<any>(null);
  const youtubeRef = useRef<any>(null);
  const instagramRef = useRef<any>(null);
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;
    return {
      startAnimation: () => {
        if (name === 'github' && githubRef.current) {
          githubRef.current.startAnimation?.();
        }
        if (name === 'youtube' && youtubeRef.current) {
          youtubeRef.current.startAnimation?.();
        }
        if (name === 'instagram' && instagramRef.current) {
          instagramRef.current.startAnimation?.();
        }
      },
      stopAnimation: () => {
        if (name === 'github' && githubRef.current) {
          githubRef.current.stopAnimation?.();
        }
        if (name === 'youtube' && youtubeRef.current) {
          youtubeRef.current.stopAnimation?.();
        }
        if (name === 'instagram' && instagramRef.current) {
          instagramRef.current.stopAnimation?.();
        }
      },
    };
  });

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlledRef.current) {
      if (animated && (name === 'github' || name === 'youtube' || name === 'instagram')) {
        // Icons auto-animate on hover
      }
    }
    onMouseEnter?.(e);
  }, [animated, name, onMouseEnter]);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlledRef.current) {
      if (animated && (name === 'github' || name === 'youtube' || name === 'instagram')) {
        // Icons auto-stop on hover leave
      }
    }
    onMouseLeave?.(e);
  }, [animated, name, onMouseLeave]);

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const shouldAnimate = animated && !prefersReducedMotion;

  // Render lucide-animated icons for supported names
  if (name === 'github' && shouldAnimate) {
    return (
      <GithubIcon
        ref={githubRef}
        size={size}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    );
  }

  if (name === 'youtube' && shouldAnimate) {
    return (
      <YoutubeIcon
        ref={youtubeRef}
        size={size}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    );
  }

  if (name === 'instagram' && shouldAnimate) {
    return (
      <InstagramIcon
        ref={instagramRef}
        size={size}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    );
  }

  // Fallback to static lucide-react icons
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as React.FC<{
    size?: number;
    className?: string;
    [key: string]: any;
  }>;

  if (LucideIcon) {
    return (
      <div className={className} {...props}>
        <LucideIcon size={size} />
      </div>
    );
  }

  // Fallback for unknown icons
  return (
    <div className={className} {...props}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    </div>
  );
});

AnimatedIcon.displayName = 'AnimatedIcon';

export { AnimatedIcon };