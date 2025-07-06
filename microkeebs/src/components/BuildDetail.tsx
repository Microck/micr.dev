import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { KeyboardBuild } from '../types/Build';
import { ImageCarousel } from './ImageCarousel';
import { YouTubeEmbed } from './YouTubeEmbed';
import { Footer } from './Footer';
import { useTheme } from '../contexts/ThemeContext';

interface BuildDetailProps {
  build: KeyboardBuild;
  onBack: () => void;
}

export function BuildDetail({ build, onBack }: BuildDetailProps) {
  const { isDark } = useTheme();
  const specEntries = Object.entries(build.specs).filter(([_, value]) => value && value !== '-');

  return (
    <div className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen`}>
      <div className="max-w-4xl mx-auto px-8 py-8">
        <button
          onClick={onBack}
          className={`flex items-center space-x-2 hover:opacity-70 mb-8 transition-all duration-300 smooth-bounce ${
            isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
          }`}
        >
          <ArrowLeft size={20} />
          <span>Back to Gallery</span>
        </button>
        
        <h1 className={`text-4xl font-bold text-center mb-12 slide-up ${
          isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
        }`}>
          {build.title}
        </h1>
        
        <div className="space-y-8">
          <div className="fade-in">
            <ImageCarousel images={build.images} title={build.title} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>Sound Test</h2>
              <YouTubeEmbed youtubeUrl={build.youtubeUrl} title={build.title} />
            </div>
            
            <div className="slide-up" style={{ animationDelay: '0.4s' }}>
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>Specifications</h2>
              <div className="specs-list space-y-1">
                {specEntries.map(([key, value], index) => (
                  <div 
                    key={key} 
                    className={`specs-reveal ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  >
                    <span className="font-normal">
                      {key}:
                    </span>
                    <span className="ml-2 font-normal">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}