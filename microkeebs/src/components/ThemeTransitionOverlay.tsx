import { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeTransitionOverlay() {
  const { isDark } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setIsActive(true);
    const timeout = setTimeout(() => setIsActive(false), 700);
    return () => clearTimeout(timeout);
  }, [isDark, mounted]);

  return (
    <div
      aria-hidden="true"
      className={`theme-transition ${isDark ? 'theme-transition--dark' : 'theme-transition--light'} ${
        isActive ? 'theme-transition--active' : ''
      }`}
    />
  );
}
