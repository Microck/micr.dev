import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BuildGallery } from './components/BuildGallery';
import { BuildDetail } from './components/BuildDetail';
import { Rankings } from './components/Rankings';
import { Contact } from './components/Contact';
import { ThemeToggle } from './components/ThemeToggle';
import { MobilePopup } from './components/MobilePopup';
import { TargetCursor } from './components/TargetCursor';
import { LenisScroll } from './components/LenisScroll';
import { PageTransitions } from './components/PageTransitions';
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
        return <Contact />;
      default:
        return (
          <BuildGallery
            onBuildSelect={handleBuildSelect}
          />
        );
    }
  };

  return (
    <LenisScroll>
      <div className={`min-h-screen ${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} relative`}>
        <PageTransitions>
          <div className="relative z-10">
            <Header currentPage={currentPage} onNavigate={handleNavigate} />
            <main>
              {renderContent()}
            </main>
          </div>
        </PageTransitions>
        <ThemeToggle />
        <MobilePopup />
        <TargetCursor />
      </div>
    </LenisScroll>
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