import React, { useEffect, useRef, useState } from 'react';
import { Youtube, Instagram } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { LogoIcon } from './icons';

// TikTok icon component since it's not in lucide-react
const TikTokIcon = ({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.56a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04.01z"/>
  </svg>
);

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { isDark } = useTheme();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const updateIndicator = () => {
      const activeButton = buttonRefs.current[currentPage];
      const nav = navRef.current;

      if (activeButton && nav) {
        const navRect = nav.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();

        setIndicatorStyle({
          left: buttonRect.left - navRect.left,
          width: buttonRect.width,
        });
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);

    return () => window.removeEventListener('resize', updateIndicator);
  }, [currentPage]);

  return (
    <header className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-[#b5b3a7]'} py-4 fade-in`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        {/* Logo */}
        <div className="flex items-center float-animation">
          <LogoIcon 
            size={48}
            className={`h-10 sm:h-12 w-auto ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}
          />
        </div>
        
        {/* Navigation */}
        <nav ref={navRef} className="flex space-x-0 order-last sm:order-none relative">
          <div
            className={`absolute bottom-0 h-full transition-all duration-300 ease-out ${
              isDark ? 'bg-[#a7a495]' : 'bg-[#1c1c1c]'
            }`}
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              zIndex: 0,
            }}
          />
          <button
            ref={(el) => (buttonRefs.current['builds'] = el)}
            onClick={() => onNavigate('builds')}
            className={`nav-item px-3 sm:px-4 py-2 text-sm font-normal relative z-10 transition-colors duration-300 ${
              currentPage === 'builds'
                ? isDark
                  ? 'text-[#1c1c1c]'
                  : 'text-[#b5b3a7]'
                : isDark
                  ? 'text-[#a7a495]'
                  : 'text-[#1c1c1c]'
            }`}
          >
            Builds
          </button>
          <button
            ref={(el) => (buttonRefs.current['rankings'] = el)}
            onClick={() => onNavigate('rankings')}
            className={`nav-item px-3 sm:px-4 py-2 text-sm font-normal relative z-10 transition-colors duration-300 ${
              currentPage === 'rankings'
                ? isDark
                  ? 'text-[#1c1c1c]'
                  : 'text-[#b5b3a7]'
                : isDark
                  ? 'text-[#a7a495]'
                  : 'text-[#1c1c1c]'
            }`}
          >
            Ranking
          </button>
          <button
            ref={(el) => (buttonRefs.current['contact'] = el)}
            onClick={() => onNavigate('contact')}
            className={`nav-item px-3 sm:px-4 py-2 text-sm font-normal relative z-10 transition-colors duration-300 ${
              currentPage === 'contact'
                ? isDark
                  ? 'text-[#1c1c1c]'
                  : 'text-[#b5b3a7]'
                : isDark
                  ? 'text-[#a7a495]'
                  : 'text-[#1c1c1c]'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Social Icons */}
        <div className="hidden sm:flex items-center space-x-4">
          <a
            href="https://www.youtube.com/@microkeebs"
            target="_blank"
            rel="noopener noreferrer"
            className={`${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} aura-scale transition-opacity hover:opacity-70`}
          >
            <Youtube size={20} />
          </a>
          <a
            href="https://www.instagram.com/microkeebs/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} aura-scale transition-opacity hover:opacity-70`}
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://www.tiktok.com/@microkeebs"
            target="_blank"
            rel="noopener noreferrer"
            className={`${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} aura-scale transition-opacity hover:opacity-70`}
          >
            <TikTokIcon size={20} />
          </a>
        </div>
      </div>
    </header>
  );
}