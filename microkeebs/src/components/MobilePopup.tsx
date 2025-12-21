import { useState, useEffect } from 'react';
import { Monitor, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function MobilePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth <= 768;
      const popupDisabled = localStorage.getItem('mobilePopupDisabled') === 'true';
      const popupDismissed = localStorage.getItem('mobilePopupDismissed') === 'true';
      
      if (isMobile && !popupDisabled && !popupDismissed) {
        setIsVisible(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('mobilePopupDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`max-w-sm w-full rounded-3xl p-6 shadow-2xl ${
        isDark ? 'bg-[#2a2a2a] text-[#a7a495]' : 'bg-[#b5b3a7] text-[#1c1c1c]'
      }`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <Monitor className={`${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`} size={32} />
            <h3 className="text-lg font-bold">Desktop Recommended</h3>
          </div>
          <button
            onClick={handleDismiss}
            className={`p-1 rounded-full hover:bg-opacity-20 ${
              isDark ? 'hover:bg-[#a7a495] hover:bg-opacity-20' : 'hover:bg-[#1c1c1c] hover:bg-opacity-20'
            } transition-colors`}
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-sm mb-6 leading-relaxed">
          This website is best viewed on desktop. It works on mobile, but some features may not function properly. 
          For the best experience, please visit on a PC.
        </p>
        
        <button
          onClick={handleDismiss}
          className={`w-full py-3 px-4 rounded-2xl font-medium transition-all ${
            isDark 
              ? 'bg-[#a7a495] text-[#1c1c1c] hover:bg-opacity-90' 
              : 'bg-[#1c1c1c] text-[#a7a495] hover:bg-opacity-90'
          }`}
        >
          I Understand
        </button>
      </div>
    </div>
  );
}