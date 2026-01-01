import { useTheme } from '../contexts/ThemeContext';
import { SunIcon } from '@/components/ui/sun';
import { MoonIcon } from '@/components/ui/moon';
import { useState } from 'react';

type DocumentWithViewTransition = Document & {
  startViewTransition(callback: () => void): { ready: Promise<void>; finished: Promise<void> };
};

// Debug component to test different logo paths
function LogoPathDebug() {
  const paths = [
    '/microkeebs/logo-mask.svg',
    '/microkeebs/logo.svg',
    '/logo-mask.svg',
    '/logo.svg',
    './logo-mask.svg',
    './logo.svg',
    'logo-mask.svg',
    'logo.svg',
    '/microkeebs/public/logo-mask.svg',
    '/public/logo-mask.svg',
    import.meta.env.BASE_URL + 'logo-mask.svg',
    import.meta.env.BASE_URL + 'logo.svg',
  ];

  return (
    <div className="fixed top-4 left-4 z-50 bg-black/90 text-white p-4 rounded-lg text-xs max-h-[90vh] overflow-auto">
      <div className="font-bold mb-2">Logo Path Debug</div>
      <div className="mb-2 text-gray-400">BASE_URL: {import.meta.env.BASE_URL}</div>
      <div className="grid gap-2">
        {paths.map((path, i) => (
          <div key={i} className="flex items-center gap-2 border-b border-gray-700 pb-2">
            <img
              src={path}
              alt={`test-${i}`}
              className="w-8 h-8 bg-white"
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = '0.2';
              }}
            />
            <code className="text-green-400 break-all">{path}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const [showDebug, setShowDebug] = useState(false);

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
    <>
      {showDebug && <LogoPathDebug />}
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="fixed bottom-6 right-20 p-2 rounded-full bg-red-600 text-white text-xs z-50"
      >
        DBG
      </button>
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
    </>
  );
}
