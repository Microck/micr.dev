import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/use-theme';
import { LogoIcon } from './icons';
import { SocialIcons } from './icons/SocialIcons';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { isDark } = useTheme();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [activeTab, setActiveTab] = useState(currentPage);
  const navRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    setActiveTab(currentPage);
  }, [currentPage]);

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const activeButton = buttonRefs.current[activeTab];
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
  }, [activeTab]);

  const handleTabClick = (page: string) => {
    setActiveTab(page);
    onNavigate(page);
  };

  return (
    <header className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-[#b5b3a7]'} py-4 fade-in`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        {/* Logo */}
        <button 
          onClick={() => handleTabClick('builds')}
          className="flex items-center float-animation cursor-pointer"
        >
          <LogoIcon 
            size={48}
            className={`h-10 sm:h-12 w-auto ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}
          />
        </button>
        
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
          <motion.button
            ref={(el) => { buttonRefs.current['builds'] = el; }}
            onClick={() => handleTabClick('builds')}
            className="nav-item px-3 sm:px-4 py-2 text-sm font-normal relative z-10"
            animate={{
              color: activeTab === 'builds'
                ? isDark ? '#1c1c1c' : '#b5b3a7'
                : isDark ? '#a7a495' : '#1c1c1c'
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            Builds
          </motion.button>
          <motion.button
            ref={(el) => { buttonRefs.current['rankings'] = el; }}
            onClick={() => handleTabClick('rankings')}
            className="nav-item px-3 sm:px-4 py-2 text-sm font-normal relative z-10"
            animate={{
              color: activeTab === 'rankings'
                ? isDark ? '#1c1c1c' : '#b5b3a7'
                : isDark ? '#a7a495' : '#1c1c1c'
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            Ranking
          </motion.button>
          <motion.button
            ref={(el) => { buttonRefs.current['blog'] = el; }}
            onClick={() => handleTabClick('blog')}
            className="nav-item px-3 sm:px-4 py-2 text-sm font-normal relative z-10"
            animate={{
              color: activeTab === 'blog'
                ? isDark ? '#1c1c1c' : '#b5b3a7'
                : isDark ? '#a7a495' : '#1c1c1c'
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            Blog
          </motion.button>
          <motion.button
            ref={(el) => { buttonRefs.current['commissions'] = el; }}
            onClick={() => handleTabClick('commissions')}
            className="nav-item px-3 sm:px-4 py-2 text-sm font-normal relative z-10"
            animate={{
              color: activeTab === 'commissions'
                ? isDark ? '#1c1c1c' : '#b5b3a7'
                : isDark ? '#a7a495' : '#1c1c1c'
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            Commissions
          </motion.button>
          <motion.button
            ref={(el) => { buttonRefs.current['contact'] = el; }}
            onClick={() => handleTabClick('contact')}
            className="nav-item px-3 sm:px-4 py-2 text-sm font-normal relative z-10"
            animate={{
              color: activeTab === 'contact'
                ? isDark ? '#1c1c1c' : '#b5b3a7'
                : isDark ? '#a7a495' : '#1c1c1c'
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            Contact
          </motion.button>
        </nav>

        {/* Social Icons */}
        <SocialIcons isDark={isDark} />
      </div>
    </header>
  );
}