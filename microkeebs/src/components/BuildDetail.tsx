import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ImageCarousel } from './ImageCarousel';
import { YouTubeEmbed } from './YouTubeEmbed';
import { Footer } from './Footer';
import { useTheme } from '../contexts/ThemeContext';
import { BuildWithSlug } from '../utils/slugs';

interface BuildDetailProps {
  builds: BuildWithSlug[];
}

export function BuildDetail({ builds }: BuildDetailProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const build = builds.find((b) => b.slug === slug);

  if (!build) {
    return (
      <div className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen flex flex-col items-center justify-center`}>
        <h1 className="text-2xl mb-4">Build not found!</h1>
        <button
          onClick={() => navigate('/')}
          className={`px-4 py-2 rounded ${isDark ? 'bg-[#a7a495] text-[#1c1c1c]' : 'bg-[#1c1c1c] text-[#a7a495]'}`}
        >
          Back to Gallery
        </button>
      </div>
    );
  }

  const specEntries = Object.entries(build.specs).filter(
    ([_, value]) => value && value !== '-'
  );

  return (
    <div className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen`}>
      <div className="max-w-4xl mx-auto px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center space-x-2 hover:opacity-70 mb-8 transition-all duration-300 smooth-bounce ${
            isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
          }`}
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <h1
          className={`text-4xl font-bold text-center mb-12 slide-up ${
            isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
          }`}
        >
          {build.title}
        </h1>

        <div className="space-y-8">
          <div className="fade-in">
            <ImageCarousel images={build.images} title={build.title} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="slide-up" style={{ animationDelay: '0.2s' }}>
              <h2
                className={`text-xl font-bold mb-4 ${
                  isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
                }`}
              >
                Sound Test
              </h2>
              <YouTubeEmbed youtubeUrl={build.youtubeUrl} title={build.title} />
            </div>

            <div className="slide-up" style={{ animationDelay: '0.4s' }}>
              <h2
                className={`text-xl font-bold mb-4 ${
                  isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
                }`}
              >
                Specifications
              </h2>
              <div className="specs-list space-y-1">
                {specEntries.map(([key, value], index) => (
                  <div
                    key={key}
                    className={`specs-reveal ${
                      isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
                    }`}
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  >
                    <span className="font-normal">{key}:</span>
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