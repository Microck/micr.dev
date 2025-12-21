import { useState } from 'react';
import { ArrowLeftIcon } from '@/components/ui/arrow-left';
import { KeyboardBuild } from '../types/Build';
import { YouTubeEmbed } from './YouTubeEmbed';
import { Footer } from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import { DecryptedText } from './DecryptedText';

interface BuildDetailProps {
  build: KeyboardBuild;
  onBack: () => void;
}

export function BuildDetail({ build, onBack }: BuildDetailProps) {
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const specEntries = Object.entries(build.specs).filter(([, value]) => value && value !== '-');

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? build.images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === build.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen`}>
      <div className="max-w-4xl mx-auto px-8 py-8">
        <button
          onClick={onBack}
          className={`flex items-center space-x-2 hover:opacity-70 mb-8 transition-all duration-300 smooth-bounce cursor-target ${
            isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
          }`}
        >
          <ArrowLeftIcon size={20} />
          <span>Back to Gallery</span>
        </button>
        
        <DecryptedText 
          text={build.title}
          animateOn="view"
          sequential={true}
          speed={30}
          className={`text-4xl font-bold text-center mb-12 ${
            isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
          }`}
          parentClassName="block text-center mb-12"
        />
        
        <div className="space-y-8">
          <div className="fade-in">
            <div className="relative w-full aspect-video">
              <img
                src={build.images[currentIndex]}
                alt={`${build.title} - Image ${currentIndex + 1}`}
                className="w-full h-full object-contain"
              />
              {build.images.length > 1 && (
                <>
                  <button
                    onClick={goToPrev}
                    className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-opacity hover:opacity-70 cursor-target ${
                      isDark ? 'bg-[#a7a495] text-[#1c1c1c]' : 'bg-[#1c1c1c] text-[#a7a495]'
                    }`}
                  >
                    <ArrowLeftIcon size={20} />
                  </button>
                  <button
                    onClick={goToNext}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-opacity hover:opacity-70 cursor-target ${
                      isDark ? 'bg-[#a7a495] text-[#1c1c1c]' : 'bg-[#1c1c1c] text-[#a7a495]'
                    }`}
                  >
                    <ArrowLeftIcon size={20} className="rotate-180" />
                  </button>
                </>
              )}
            </div>
            {build.images.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {build.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all cursor-target ${
                      index === currentIndex
                        ? isDark ? 'bg-[#a7a495]' : 'bg-[#1c1c1c]'
                        : isDark ? 'bg-[#a7a495]/30' : 'bg-[#1c1c1c]/30'
                    }`}
                  />
                ))}
              </div>
            )}
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