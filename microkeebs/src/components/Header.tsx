import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { LogoIcon, TikTokIcon, AnimatedYoutubeIcon, AnimatedInstagramIcon } from './icons';

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
          <motion.div
            className={`absolute bottom-0 h-full ${
              isDark ? 'bg-[#a7a495]' : 'bg-[#1c1c1c]'
            }`}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            transition={{
              type: 'tween',
              ease: 'easeOut',
              duration: 0.3,
            }}
            style={{
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
            className={`${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} aura-scale transition-opacity hover:opacity-70 interactive`}
          >
            <AnimatedYoutubeIcon size={20} />
          </a>
          <a
            href="https://www.instagram.com/microkeebs/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} aura-scale transition-opacity hover:opacity-70 interactive`}
          >
            <AnimatedInstagramIcon size={20} />
          </a>
          <a
            href="https://www.tiktok.com/@microkeebs"
            target="_blank"
            rel="noopener noreferrer"
            className={`${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} aura-scale transition-opacity hover:opacity-70 interactive`}
          >
            <TikTokIcon size={20} />
          </a>
        </div>
      </div>
    </header>
  );
}