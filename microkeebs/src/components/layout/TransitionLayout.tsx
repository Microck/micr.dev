import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useLenis } from '../../contexts/LenisContext';

const EXIT_DURATION = 0.25;
const ENTER_DURATION = 0.75;
const SCROLL_STORAGE_PREFIX = 'route-scroll::';

interface TransitionLayoutProps {
  children: ReactNode;
  routeKey: string;
  className?: string;
}

export function TransitionLayout({ children, routeKey, className }: TransitionLayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const displayedKeyRef = useRef(routeKey);
  const lenis = useLenis();
  const scrollPositionsRef = useRef<Record<string, number>>({});
  const entryTweenRef = useRef<gsap.core.Tween | null>(null);
  const frameRef = useRef<number | null>(null);

  const shouldReduceMotion = () => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  const storeScrollPosition = (key: string) => {
    if (typeof window === 'undefined') {
      return;
    }
    const position = lenis?.scroll ?? window.scrollY ?? 0;
    scrollPositionsRef.current[key] = position;
    try {
      window.sessionStorage.setItem(`${SCROLL_STORAGE_PREFIX}${key}`, `${Math.round(position)}`);
    } catch {
      return;
    }
  };

  const getStoredScrollPosition = (key: string) => {
    if (typeof scrollPositionsRef.current[key] === 'number') {
      return scrollPositionsRef.current[key];
    }

    if (typeof window === 'undefined') {
      return 0;
    }

    try {
      const cachedValue = window.sessionStorage.getItem(`${SCROLL_STORAGE_PREFIX}${key}`);
      if (cachedValue) {
        const parsed = parseInt(cachedValue, 10);
        return Number.isNaN(parsed) ? 0 : parsed;
      }
    } catch {
      return 0;
    }

    return 0;
  };

  const applyScrollPosition = (value: number) => {
    if (lenis) {
      lenis.scrollTo(value, { immediate: true });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: value });
    }
  };

  useEffect(() => {
    return () => {
      entryTweenRef.current?.kill();
      entryTweenRef.current = null;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (routeKey === displayedKeyRef.current) {
      setDisplayedChildren(children);
      return;
    }

    if (!contentRef.current) {
      displayedKeyRef.current = routeKey;
      setDisplayedChildren(children);
      return;
    }

    storeScrollPosition(displayedKeyRef.current);

    if (shouldReduceMotion()) {
      displayedKeyRef.current = routeKey;
      setDisplayedChildren(children);
      applyScrollPosition(getStoredScrollPosition(routeKey));
      return;
    }

    const animateIn = () => {
      applyScrollPosition(getStoredScrollPosition(routeKey));

      entryTweenRef.current = gsap.fromTo(
        contentRef.current,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: ENTER_DURATION,
          ease: 'power2.out',
          onComplete: () => {
            entryTweenRef.current = null;
          },
        },
      );
    };

    const scheduleAnimateIn = () => {
      if (typeof window === 'undefined') {
        animateIn();
        return;
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        animateIn();
      });
    };

    const exitTimeline = gsap.timeline({
      defaults: {
        ease: 'power2.out',
      },
      onComplete: () => {
        displayedKeyRef.current = routeKey;
        setDisplayedChildren(children);
        scheduleAnimateIn();
      },
    });

    exitTimeline.to(contentRef.current, {
      autoAlpha: 0,
      duration: EXIT_DURATION,
    });

    return () => {
      exitTimeline.kill();
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      if (entryTweenRef.current) {
        entryTweenRef.current.kill();
        entryTweenRef.current = null;
      }
    };
  }, [routeKey, children, lenis]);

  useEffect(() => {
    if (shouldReduceMotion() || !contentRef.current) {
      return;
    }

    const introTween = gsap.fromTo(
      contentRef.current,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: ENTER_DURATION,
        ease: 'power2.out',
        delay: 0.1,
      },
    );

    return () => {
      introTween.kill();
    };
  }, []);

  const wrapperClassName = ['transition-layout relative', className].filter(Boolean).join(' ');

  return (
    <div className={wrapperClassName}>
      <div ref={contentRef} className="transition-layout__content will-change-transform">
        {displayedChildren}
      </div>
    </div>
  );
}
