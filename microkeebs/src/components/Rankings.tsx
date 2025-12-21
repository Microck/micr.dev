import { useRef, useLayoutEffect } from 'react';
import { KeyboardBuild } from '../types/Build';
import { Footer } from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import { CherryIcon, DomeIcon } from './icons';
import { FolderHeartIcon } from '@/components/ui/folder-heart';
import { EyeIcon } from '@/components/ui/eye';
import { AudioLinesIcon } from '@/components/ui/audio-lines';
import { HandHeartIcon } from '@/components/ui/hand-heart';
import builds from '../data/builds.json';
import rankings from '../data/rankings.json';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RankingsProps {
  onBuildSelect: (build: KeyboardBuild) => void;
}

export function Rankings({ onBuildSelect }: RankingsProps) {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Function to get builds by IDs from rankings
  const getBuildsByIds = (ids: string[]): KeyboardBuild[] => {
    return ids.map(id => {
      const build = (builds as unknown as KeyboardBuild[]).find(b => b.id === id);
      if (!build) return null;
      return build;
    }).filter((build): build is KeyboardBuild => build !== null);
  };

  const allRankings = getBuildsByIds(rankings.all);
  const lookRankings = getBuildsByIds(rankings.look);
  const soundRankings = getBuildsByIds(rankings.sound);
  const feelRankings = getBuildsByIds(rankings.feel);
  const mechanicalRankings = getBuildsByIds(rankings.mechanical);
  const electrocapacitiveRankings = getBuildsByIds(rankings.electrocapacitive);

  useLayoutEffect(() => {
    // Only enable horizontal scroll on larger screens
    if (window.innerWidth < 768) return;

    const ctx = gsap.context(() => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const totalWidth = scroller.scrollWidth;
      const windowWidth = window.innerWidth;
      const scrollDistance = totalWidth - windowWidth;

      gsap.to(scroller, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: () => "+=" + scrollDistance,
          invalidateOnRefresh: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getMetalGradient = (index: number) => {
    switch (index) {
      case 0: return 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 text-transparent bg-clip-text font-bold metal-shine';
      case 1: return isDark 
          ? 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-transparent bg-clip-text font-bold metal-shine'
          : 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 text-transparent bg-clip-text font-bold metal-shine';
      case 2: return 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-transparent bg-clip-text font-bold metal-shine';
      default: return isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]';
    }
  };

  const RankingCard = ({ 
    title, 
    icon, 
    rankings,
    className = ""
  }: { 
    title: string; 
    icon: React.ReactNode; 
    rankings: KeyboardBuild[];
    className?: string;
  }) => (
    <div className={`p-6 card-hover ${className} ${
      isDark ? 'bg-[#2a2a2a]' : 'bg-[#b5b3a7]'
    } rounded-3xl cursor-target flex-shrink-0 w-full sm:w-[400px]`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className={`smooth-bounce ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>
          {icon}
        </div>
        <h2 className={`text-xl font-bold ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>{title}</h2>
      </div>
      <div className="space-y-2">
        {rankings.map((build, index) => (
          <div key={build.id}>
            <div
              onClick={() => onBuildSelect(build)}
              className={`ranking-item flex items-center space-x-4 cursor-pointer p-3 transition-all duration-300 ${
                index < 3 ? 'relative overflow-hidden' : ''
              }`}
            >
              <span className={`text-2xl font-bold w-8 float-animation ${
                getMetalGradient(index)
              } relative z-10`}>
                {index + 1}
              </span>
              <div className="w-16 h-12 overflow-hidden rounded flex-shrink-0 relative z-10">
                <div className={`absolute inset-0 animate-pulse ${isDark ? 'bg-[#3a3a3a]' : 'bg-[#c5c3b7]'}`} />
                <img
                  src={build.images[0]}
                  alt={build.title}
                  className="w-full h-full object-cover opacity-0 transition-opacity duration-300 relative"
                  loading="lazy"
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.classList.remove('opacity-0');
                    const skeleton = img.previousElementSibling as HTMLElement;
                    if (skeleton) skeleton.style.display = 'none';
                  }}
                />
              </div>
              <span className={`font-normal text-base ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} relative z-10`}>{build.title}</span>
            </div>
            {index < rankings.length - 1 && (
              <div className={`border-b mx-3 ${
                isDark ? 'border-[#a7a495] border-opacity-20' : 'border-[#1c1c1c] border-opacity-20'
              }`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen overflow-hidden`}>
      <div 
        ref={scrollerRef} 
        className="flex flex-col md:flex-row h-auto md:h-screen items-center px-4 md:px-20 py-20 gap-8 md:gap-16 w-full md:w-max"
      >
        {/* Intro / All Rankings */}
        <div className="flex-shrink-0 w-full md:w-[500px]">
          <h1 className={`text-4xl md:text-6xl font-bold mb-8 ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>
            Rankings
          </h1>
          <RankingCard
            title="All Time Favorites"
            icon={<FolderHeartIcon size={32} />}
            rankings={allRankings}
            className="w-full"
          />
        </div>

        {/* Categories 1 */}
        <div className="flex flex-col gap-6">
          <RankingCard
            title="Look"
            icon={<EyeIcon size={24} />}
            rankings={lookRankings}
          />
          <RankingCard
            title="Sound"
            icon={<AudioLinesIcon size={24} />}
            rankings={soundRankings}
          />
        </div>

        {/* Categories 2 */}
        <div className="flex flex-col gap-6">
          <RankingCard
            title="Feel"
            icon={<HandHeartIcon size={24} />}
            rankings={feelRankings}
          />
           <RankingCard
            title="Mechanical"
            icon={<CherryIcon size={20} />}
            rankings={mechanicalRankings}
          />
        </div>

        {/* Categories 3 & Info */}
        <div className="flex flex-col gap-6">
          <RankingCard
            title="Electrocapacitive"
            icon={<DomeIcon size={20} />}
            rankings={electrocapacitiveRankings}
          />
          
          <div className="w-full sm:w-[400px] p-6">
            <p className={`text-lg leading-relaxed ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>
              All rankings are fully subjective. I rank builds as a whole—including switches, 
              keycaps, color, and modifications—not just the keyboard kit itself.
            </p>
          </div>
        </div>
        
        {/* Footer in scroll */}
        <div className="flex-shrink-0">
            <Footer />
        </div>
      </div>
    </div>
  );
}
