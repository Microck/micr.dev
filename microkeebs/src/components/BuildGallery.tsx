import React, { useState } from 'react';
import { KeyboardBuild } from '../types/Build';
import { BuildCard } from './BuildCard';
import { Footer } from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import builds from '../data/builds.json';

interface BuildGalleryProps {
  onBuildSelect: (build: KeyboardBuild) => void;
}

export function BuildGallery({ onBuildSelect }: BuildGalleryProps) {
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [activeFilter, setActiveFilter] = useState('All');
  const { isDark } = useTheme();

  // Filter builds based on active filter
  const filteredBuilds = builds.filter(build => {
    if (activeFilter === 'All') return true;
    return build.category === activeFilter;
  });

  // Sort filtered builds
  const sortedBuilds = [...filteredBuilds].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  return (
    <div className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-12 fade-in">
          {/* Timestamp toggle */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={showTimestamps}
                onChange={(e) => setShowTimestamps(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-4 h-4 border transition-all duration-300 ${
                showTimestamps 
                  ? isDark 
                    ? 'bg-[#a7a495] scale-110 border-[#a7a495]' 
                    : 'bg-[#1c1c1c] scale-110 border-[#1c1c1c]'
                  : isDark 
                    ? 'bg-[#2a2a2a] border-[#a7a495]' 
                    : 'bg-[#b5b3a7] border-[#1c1c1c]'
              }`}>
                {showTimestamps && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className={`w-2 h-2 ${isDark ? 'bg-[#1c1c1c]' : 'bg-[#b5b3a7]'}`}></div>
                  </div>
                )}
              </div>
            </div>
            <span className={`text-sm font-normal ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>Show timestamps</span>
          </label>
          
          {/* Sort dropdown */}
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-normal ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`border px-3 py-1 text-sm button-morph ${
                isDark 
                  ? 'bg-[#2a2a2a] border-[#a7a495] text-[#a7a495]' 
                  : 'bg-[#b5b3a7] border-[#1c1c1c] text-[#1c1c1c]'
              }`}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          {/* Filter buttons */}
          <div className="flex items-center space-x-0">
            <button
              onClick={() => setActiveFilter('All')}
              className={`px-3 sm:px-4 py-1 text-sm font-normal button-morph ${
                activeFilter === 'All'
                  ? isDark 
                    ? 'bg-[#a7a495] text-[#1c1c1c]' 
                    : 'bg-[#1c1c1c] text-[#b5b3a7]'
                  : isDark 
                    ? 'bg-[#2a2a2a] text-[#a7a495] hover:opacity-70' 
                    : 'bg-[#b5b3a7] text-[#1c1c1c] hover:opacity-70'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('MX')}
              className={`px-3 sm:px-4 py-1 text-sm font-normal button-morph ${
                activeFilter === 'MX'
                  ? isDark 
                    ? 'bg-[#a7a495] text-[#1c1c1c]' 
                    : 'bg-[#1c1c1c] text-[#b5b3a7]'
                  : isDark 
                    ? 'bg-[#2a2a2a] text-[#a7a495] hover:opacity-70' 
                    : 'bg-[#b5b3a7] text-[#1c1c1c] hover:opacity-70'
              }`}
            >
              MX
            </button>
            <button
              onClick={() => setActiveFilter('EC')}
              className={`px-3 sm:px-4 py-1 text-sm font-normal button-morph ${
                activeFilter === 'EC'
                  ? isDark 
                    ? 'bg-[#a7a495] text-[#1c1c1c]' 
                    : 'bg-[#1c1c1c] text-[#b5b3a7]'
                  : isDark 
                    ? 'bg-[#2a2a2a] text-[#a7a495] hover:opacity-70' 
                    : 'bg-[#b5b3a7] text-[#1c1c1c] hover:opacity-70'
              }`}
            >
              EC
            </button>
          </div>
        </div>

        {/* Grid - Responsive: 1 column on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sortedBuilds.map((build, index) => (
            <div key={build.id} className={`stagger-item`} style={{ animationDelay: `${index * 0.1}s` }}>
              <BuildCard
                build={build}
                onClick={() => onBuildSelect(build)}
              />
              {showTimestamps && (
                <div className={`text-xs text-center mt-2 ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>
                  {new Date(build.timestamp).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}