import { useTheme } from '../contexts/ThemeContext';
import { SunIcon } from '@/components/ui/sun';
import { MoonIcon } from '@/components/ui/moon';

type DocumentWithViewTransition = Document & {
  startViewTransition(callback: () => void): { ready: Promise<void>; finished: Promise<void> };
};

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  const handleToggle = () => {
    if (!('startViewTransition' in document)) {
      toggleTheme();
      return;
    }

    const doc = document as unknown as DocumentWithViewTransition;
    doc.startViewTransition(() => {
      toggleTheme();
    });
  };

  return (
    <button
      onClick={handleToggle}
      className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 z-40 hover:scale-110 active:scale-95 cursor-target ${
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
