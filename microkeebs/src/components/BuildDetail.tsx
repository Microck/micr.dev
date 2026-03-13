import { ArrowLeftIcon } from '@/components/ui/arrow-left';
import { KeyboardBuild } from '../types/Build';
import { YouTubeEmbed } from './YouTubeEmbed';
import { Footer } from './Footer';
import { useTheme } from '../contexts/use-theme';
import { DecryptedText } from './DecryptedText';
import { ThumbnailSlider } from './ThumbnailSlider';

interface BuildDetailProps {
  build: KeyboardBuild;
  onBack: () => void;
}

export function BuildDetail({ build, onBack }: BuildDetailProps) {
  const { isDark } = useTheme();
  
  const titleMb = '2rem';
  const galleryGap = '2rem';
  const sliderMb = '0.25rem';
  
  const specEntries = Object.entries(build.specs).filter(([, value]) => value && value !== '-');

  return (
    <div className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen relative`}>
      <div className="max-w-4xl mx-auto px-8 pt-12 pb-8">
        <button
          onClick={onBack}
          className={`flex items-center space-x-2 hover:opacity-70 mb-4 transition-all duration-300 smooth-bounce cursor-target ${
            isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
          }`}
        >
          <ArrowLeftIcon size={20} />
          <span>Back to Gallery</span>
        </button>
        
          <div style={{ marginBottom: titleMb }}>
            <DecryptedText 
              text={build.title}
              animateOn="view"
              sequential={true}
              speed={30}
              className={`text-4xl font-bold text-center ${
                isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
              }`}
              parentClassName="block text-center"
            />
          </div>
          
          <div className="flex flex-col" style={{ gap: galleryGap }}>
            <div className="fade-in">
              <ThumbnailSlider images={build.images} mainImageMb={sliderMb} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="slide-up" style={{ animationDelay: '0.2s' }}>
                <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>Sound Test</h2>
                <YouTubeEmbed youtubeUrl={build.youtubeUrl} title={build.title} />
              </div>
              
              <div className="slide-up" style={{ animationDelay: '0.4s' }}>
                <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>Specifications</h2>
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
