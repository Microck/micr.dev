import { useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon } from '@/components/ui/sun';
import { MoonIcon } from '@/components/ui/moon';

interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
  updateCallbackDone: Promise<void>;
}

type DocumentWithViewTransition = Document & {
  startViewTransition(callback: () => void): ViewTransition;
};

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Check for View Transitions API support
    if (!('startViewTransition' in document)) {
      toggleTheme();
      return;
    }

    const doc = document as unknown as DocumentWithViewTransition;
    const transition = doc.startViewTransition(() => {
      toggleTheme();
    });

    await transition.ready;

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];

    document.documentElement.animate(
      { clipPath: isDark ? clipPath : [...clipPath].reverse() },
      {
        duration: 500,
        easing: 'ease-out',
        pseudoElement: isDark ? '::view-transition-new(root)' : '::view-transition-old(root)',
      }
    );
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 z-[101] hover:scale-110 active:scale-95 cursor-target ${
        isDark
          ? 'bg-[#2a2a2a] hover:bg-[#3a3a3a] shadow-black/30'
          : 'bg-[#b5b3a7] hover:bg-[#c5c3b7] shadow-black/10'
      }`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <SunIcon size={24} className="transition-colors duration-300 text-[#a7a495]" />
      ) : (
        <MoonIcon size={24} className="transition-colors duration-300 text-[#1c1c1c]" />
      )}
    </button>
  );
}
