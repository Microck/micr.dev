import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BuildGallery } from './components/BuildGallery';
import { BuildDetail } from './components/BuildDetail';
import { Rankings } from './components/Rankings';
import { Footer } from './components/Footer';
import { AuraBackground } from './components/AuraBackground';
// import { CatIcon } from './components/icons';
import { ThemeToggle } from './components/ThemeToggle';
import { MobilePopup } from './components/MobilePopup';
import { KeyboardBuild } from './types/Build';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { findBuildBySlug } from './utils/slugUtils';
import builds from './data/builds.json';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('builds');
  const [selectedBuild, setSelectedBuild] = useState<KeyboardBuild | null>(null);
  const { isDark } = useTheme();

  // Handle URL-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/builds/')) {
        const slugPath = hash.replace('#/builds/', '');
        const parts = slugPath.split('/');
        const baseSlug = parts[0];
        const counter = parts[1];
        
        const build = findBuildBySlug(baseSlug, counter, builds as any);
        if (build) {
          setSelectedBuild(build);
          setCurrentPage('builds');
        }
      } else if (hash === '#/rankings') {
        setCurrentPage('rankings');
        setSelectedBuild(null);
      } else if (hash === '#/contact') {
        setCurrentPage('contact');
        setSelectedBuild(null);
      } else {
        setCurrentPage('builds');
        setSelectedBuild(null);
      }
    };

    // Initial load
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: string) => {
    if (page === 'builds') {
      window.location.hash = '#/builds';
    } else if (page === 'rankings') {
      window.location.hash = '#/rankings';
    } else if (page === 'contact') {
      window.location.hash = '#/contact';
    }
  };

  const handleBuildSelect = (build: KeyboardBuild) => {
    const slugInfo = findBuildBySlug(build.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), undefined, builds as any);
    const baseSlug = build.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const sameTitleBuilds = builds
      .filter(b => b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === baseSlug)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    const index = sameTitleBuilds.findIndex(b => b.id === build.id);
    const counter = sameTitleBuilds.length > 1 ? `/${index + 1}` : '';
    
    window.location.hash = `#/builds/${baseSlug}${counter}`;
  };

  const handleBackToGallery = () => {
    window.location.hash = '#/builds';
  };

  const renderContent = () => {
    if (selectedBuild) {
      return (
        <BuildDetail
          build={selectedBuild}
          onBack={handleBackToGallery}
        />
      );
    }

    switch (currentPage) {
      case 'builds':
        return (
          <BuildGallery
            onBuildSelect={handleBuildSelect}
          />
        );
      case 'rankings':
        return (
          <Rankings
            onBuildSelect={handleBuildSelect}
          />
        );
      case 'contact':
        return (
          <div className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Left Column - About */}
                <div className="slide-up">
                  <h1 className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} mb-8 aura-bounce-in`}>About me</h1>
                  <div className={`space-y-4 ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} font-normal leading-relaxed text-sm sm:text-base`}>
                    <p className="fade-in aura-slide" style={{ animationDelay: '0.2s' }}>
                      I joined the keyboard hobby in early 2021 and have been active since then, but I didn't build my first custom keyboard until mid-2022, when I also started Microkeebs as a way to showcase my keyboards.
                    </p>
                    <p className="fade-in aura-slide" style={{ animationDelay: '0.4s' }}>
                      I began doing streams and content in Spanish, my native language, building keyboards for people who commissioned me, which allowed me to try a lot of keyboards without having to buy each and every one of them, as I couldn't afford it. I also made some educational videos to try and expand the hobby in Spain. I'm not good at dealing with people, so when I closed commissions, I quickly ran out of content to make and lost motivation, so I took a hiatus from December 2022 to July 2023. I was still in the hobby during this time but just didn't create content.
                    </p>
                    <p className="fade-in aura-slide" style={{ animationDelay: '0.6s' }}>
                      After switching setups and buying some better equipment, I tried to come back to making videos, but this time for a wider audience, so I switched from Spanish to English content. I slowly started picking up the pace again, making more educational videos (this time in English) and creating more content. Brands and friends started sending me keyboards to review, allowing me to create more and more content.
                    </p>
                    <p className="fade-in aura-slide" style={{ animationDelay: '0.8s' }}>
                      But then I got burned out. Build videos took hours and days to do, but received little to no support. I stopped doing them because I liked it and started making them because "I had to," which obviously decreased the quality of those videos and made them unsustainable in the long run. So I decided to stop. In my opinion, the keyboard hobby is not made for long-duration videos unless you're already established or decide to clickbait/follow trends.
                    </p>
                    <p className="fade-in aura-slide" style={{ animationDelay: '1.0s' }}>
                      I have gone back to doing just what I love, without feeling obliged to do anything I don't feel like doing. This has allowed me to develop a certain personal style and improve my videos' quality over time (as of the time of writing this, my videos are recorded with an iPhone, and if you hadn't noticed, that's a sign that I'm doing a good job). I will keep making content with this mindset, looking forward to what I hope will be many more keyboards to come!
                    </p>
                  </div>
                </div>
                
                {/* Right Column - Contact */}
                <div className="slide-up" style={{ animationDelay: '0.3s' }}>
                  <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} mb-6 aura-bounce-in`}>Email</h2>
                  <p className={`${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} font-normal mb-4 fade-in aura-slide text-sm sm:text-base`} style={{ animationDelay: '0.5s' }}>
                    Only business inquiries will be responded to.
                  </p>
                  <a
                    href="mailto:microkeebs@gmail.com"
                    className={`${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} font-normal hover:opacity-70 transition-all duration-300 smooth-bounce fade-in aura-slide text-sm sm:text-base aura-glow inline-block px-4 py-2 rounded-lg`}
                    style={{ animationDelay: '0.7s' }}
                  >
                    microkeebs@gmail.com
                  </a>
                  <div className="mt-6 flex justify-center">
                    <div className="relative aura-morph">
                      <img 
                        src="/microkeebs/public/cat.png" 
                        alt="Cat" 
                        className={`w-32 h-32 rounded-lg transition-all duration-300 ${
                          isDark ? 'opacity-80' : 'opacity-100'
                        }`}
                      />
                      <div className="absolute -top-2 -right-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full icon-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        );
      default:
        return (
          <BuildGallery
            onBuildSelect={handleBuildSelect}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} relative`}>
      <AuraBackground />
      <div className="relative z-10">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
        <main>
          {renderContent()}
        </main>
        <ThemeToggle />
        <MobilePopup />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;