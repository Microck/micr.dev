import React from 'react';
import { Trophy, Eye, Volume2, Hand } from 'lucide-react';
import { KeyboardBuild } from '../types/Build';
import { Footer } from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import builds from '../data/builds.json';
import rankings from '../data/rankings.json';

interface RankingsProps {
  onBuildSelect: (build: KeyboardBuild) => void;
}

export function Rankings({ onBuildSelect }: RankingsProps) {
  const { isDark } = useTheme();

  // Function to get builds by IDs from rankings
  const getBuildsByIds = (ids: string[]): KeyboardBuild[] => {
    return ids.map(id => {
      const build = builds.find(b => b.id === id);
      if (!build) {
        console.warn(`Build with ID "${id}" not found in builds.json`);
        return null;
      }
      return build;
    }).filter(Boolean) as KeyboardBuild[];
  };

  const allRankings = getBuildsByIds(rankings.all);
  const lookRankings = getBuildsByIds(rankings.look);
  const soundRankings = getBuildsByIds(rankings.sound);
  const feelRankings = getBuildsByIds(rankings.feel);

  // Function to get metal gradient class based on position
  const getMetalGradient = (index: number) => {
    switch (index) {
      case 0: // 1st place - Gold
        return 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 text-transparent bg-clip-text font-bold metal-shine';
      case 1: // 2nd place - Silver (darker for light mode)
        return isDark 
          ? 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-transparent bg-clip-text font-bold metal-shine'
          : 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 text-transparent bg-clip-text font-bold metal-shine';
      case 2: // 3rd place - Bronze
        return 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-transparent bg-clip-text font-bold metal-shine';
      default:
        return isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]';
    }
  };

  const RankingCard = ({ 
    title, 
    icon, 
    rankings,
    isLarge = false,
    delay = 0
  }: { 
    title: string; 
    icon: React.ReactNode; 
    rankings: KeyboardBuild[];
    isLarge?: boolean;
    delay?: number;
  }) => (
    <div className={`p-4 sm:p-6 card-hover slide-up ${isLarge ? 'col-span-1 sm:col-span-2' : ''} ${
      isDark ? 'bg-[#2a2a2a]' : 'bg-[#b5b3a7]'
    } rounded-3xl`} style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center space-x-3 mb-4 sm:mb-6">
        <div className="smooth-bounce">
          {React.cloneElement(icon as React.ReactElement, { 
            className: `${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`,
            size: 20
          })}
        </div>
        <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>{title}</h2>
      </div>
      <div className="space-y-0">
        {rankings.map((build, index) => (
          <div key={build.id}>
            <div
              onClick={() => onBuildSelect(build)}
              className="ranking-item flex items-center space-x-3 sm:space-x-4 cursor-pointer p-2 sm:p-3 transition-all duration-300"
            >
              <span className={`text-xl sm:text-2xl font-bold w-6 sm:w-8 float-animation ${
                getMetalGradient(index)
              }`} style={{ animationDelay: `${index * 0.2}s` }}>
                {index + 1}
              </span>
              <div className="w-12 sm:w-16 h-9 sm:h-12 overflow-hidden rounded flex-shrink-0">
                <img
                  src={build.images[0]}
                  alt={build.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="sync"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.nextElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
                {/* Fallback placeholder */}
                <div className="placeholder-bg w-full h-full hidden items-center justify-center">
                  <span className={`text-xs ${isDark ? 'text-[#1c1c1c]' : 'text-[#1c1c1c]'}`}>PLACEHOLDER</span>
                </div>
              </div>
              <span className={`font-normal text-sm sm:text-base ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>{build.title}</span>
            </div>
            {index < rankings.length - 1 && (
              <div className={`border-b mx-2 sm:mx-3 ${
                isDark ? 'border-[#a7a495] border-opacity-20' : 'border-[#1c1c1c] border-opacity-20'
              }`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
          <RankingCard
            title="All"
            icon={<Trophy size={24} />}
            rankings={allRankings}
            isLarge={true}
            delay={0.1}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          <RankingCard
            title="Look"
            icon={<Eye size={24} />}
            rankings={lookRankings}
            delay={0.3}
          />
          
          <RankingCard
            title="Sound"
            icon={<Volume2 size={24} />}
            rankings={soundRankings}
            delay={0.5}
          />
          
          <RankingCard
            title="Feel"
            icon={<Hand size={24} />}
            rankings={feelRankings}
            delay={0.7}
          />
        </div>
        
        <div className="text-center fade-in" style={{ animationDelay: '0.9s' }}>
          <p className={`text-sm max-w-2xl mx-auto leading-relaxed px-4 ${
            isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
          }`}>
            All my rankings are fully subjective. I will be ranking my build as a whole—including the switches, 
            keycaps, color, and any other modifications I have made—not just the keyboard itself.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}