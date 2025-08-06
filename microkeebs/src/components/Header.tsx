import React from 'react';
import { Youtube, Instagram } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// TikTok icon component since it's not in lucide-react
const TikTokIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
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

  return (
    <header className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-[#b5b3a7]'} py-4 fade-in`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        {/* Logo */}
        <div className="flex items-center float-animation">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 352.95416 352.95416"
            className="h-10 sm:h-12 w-auto"
          >
            <path
              fill={isDark ? '#a7a495' : '#1c1c1c'}
              d="m -37.409502,310.53546 c -2.149485,-0.57803 -3.882519,-1.63648 -5.447967,-3.32736 -1.921983,-2.07597 -2.841536,-4.08197 -2.952282,-6.44039 -0.04783,-1.01865 -0.278762,-5.42396 -0.513175,-9.78959 -0.354378,-6.59982 -0.405636,-12.28496 -0.304154,-33.73437 l 0.12205,-25.79688 0.695169,-3.80515 c 2.753079,-15.06954 8.229154,-27.39025 17.136875,-38.55652 5.456299,-6.83974 13.612742,-14.44283 18.6799074,-17.41262 6.1409733,-3.59912 7.2003248,-12.05332 2.0994947,-16.7551 -0.6519965,-0.60099 -1.8212673,-1.41459 -2.5983791,-1.80799 -0.777113,-0.3934 -1.556724,-0.91981 -1.732471,-1.16978 -0.175746,-0.24998 -0.949396,-0.72546 -1.719222,-1.05663 -0.769825,-0.33117 -2.008088,-1.1219 -2.751695,-1.75719 -0.743606,-0.63528 -1.431974,-1.15506 -1.529707,-1.15506 -0.09773,0 -0.789238,-0.48339 -1.536679,-1.07421 -0.747441,-0.59082 -1.703239,-1.25224 -2.123996,-1.46982 -0.420757,-0.21758 -1.38329,-1.05489 -2.138962,-1.86068 -0.755672,-0.8058 -2.83568,-2.97211 -4.62224,-4.81404 -2.206496,-2.27487 -3.474768,-3.81567 -3.954442,-4.80416 -0.388384,-0.80037 -1.196153,-2.00866 -1.795043,-2.6851 -0.59889,-0.67644 -1.541027,-2.10519 -2.093639,-3.175 -0.552611,-1.06981 -1.403914,-2.59996 -1.891783,-3.40032 -0.487869,-0.80036 -1.025891,-1.87193 -1.195606,-2.38125 -0.169714,-0.50932 -0.992761,-2.35479 -1.828992,-4.10104 -0.836231,-1.74625 -1.831064,-4.3061 -2.210739,-5.68854 -0.379676,-1.38245 -0.939054,-3.40651 -1.243063,-4.49792 -0.921981,-3.30995 -0.995826,-3.69982 -1.453327,-7.67292 -0.621388,-5.396325 -0.749298,-9.210322 -0.417049,-12.435413 0.157411,-1.527968 0.418028,-4.028281 0.579147,-5.55625 0.174802,-1.657715 0.655926,-3.951887 1.192976,-5.688541 0.495017,-1.600729 1.145773,-4.14973 1.446124,-5.664446 0.477495,-2.408078 0.882032,-3.438392 3.220421,-8.202083 1.470881,-2.99643 3.131645,-6.175295 3.690588,-7.064146 0.558942,-0.88885 1.016259,-1.710783 1.016259,-1.826518 0,-0.115735 0.595313,-0.839882 1.322917,-1.609216 0.727604,-0.769334 1.322917,-1.579223 1.322917,-1.79975..."
            />
          </svg>
        </div>
        
        {/* Navigation - Centered on desktop, full width on mobile */}
        <nav className="flex space-x-0 order-last sm:order-none">
          <button
            onClick={() => onNavigate('builds')}
            className={`nav-item px-3 sm:px-4 py-2 text-sm font-normal button-morph ${
              currentPage === 'builds'
                ? isDark ? 'bg-[#a7a495] text-[#1c1c1c]' : 'bg-[#1c1c1c] text-[#b5b3a7]'
                : isDark ? 'text-[#a7a495] hover:bg-[#1c1c1c]' : 'text-[#1c1c1c] hover:bg-[#a7a495]'
            }`}
          >
            Builds
          </button>
          <button
            onClick={() => onNavigate('rankings')}
            className={`nav-item px-3 sm:px-4 py-2 text-sm font-normal button-morph ${
              currentPage === 'rankings'
                ? isDark ? 'bg-[#a7a495] text-[#1c1c1c]' : 'bg-[#1c1c1c] text-[#b5b3a7]'
                : isDark ? 'text-[#a7a495] hover:bg-[#1c1c1c]' : 'text-[#1c1c1c] hover:bg-[#a7a495]'
            }`}
          >
            Ranking
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`nav-item px-3 sm:px-4 py-2 text-sm font1c1c] hover:bg-[#a7a495]'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Social Icons - Hidden on mobile to save space */}
        <div className="hidden sm:flex items-center space-x-4">
          <a
            href="https://www.youtube.com/@microkeebs"
            target="_blank"
            rel="noopener noreferrer"
            className={`${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} smooth-bounce transition-opacity hover:opacity-70`}
          >
            <Youtube size={20} />
          </a>
          <a
            href="https://www.instagram.com/microkeebs/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} smooth-bounce transition-opacity hover:opacity-70`}
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://www.tiktok.com/@microkeebs"
            target="_blank"
            rel="noopener noreferrer"
            className={`${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} smooth-bounce transition-opacity hover:opacity-70`}
          >
            <TikTokIcon size={20} />
          </a>
        </div>
      </div>
    </header>
  );
}