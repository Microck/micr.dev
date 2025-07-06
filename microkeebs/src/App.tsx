import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { BuildGallery } from './components/BuildGallery';
import { BuildDetail } from './components/BuildDetail';
import { Rankings } from './components/Rankings';
import { Footer } from './components/Footer';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { getBuildsWithSlugs } from './utils/slugs';
import buildsData from './data/builds.json';

// Generate slugs for all builds once
const buildsWithSlugs = getBuildsWithSlugs(buildsData);

// New component for the Contact page for cleaner routing
function ContactPage() {
  const { isDark } = useTheme();
  return (
    <div className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - About */}
          <div className="slide-up">
            <h1 className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} mb-8`}>About me</h1>
            <div className={`space-y-4 ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} font-normal leading-relaxed text-sm sm:text-base`}>
              <p className="fade-in" style={{ animationDelay: '0.2s' }}>
                I'm Marcos, also known as Microkeebs...
              </p>
              {/* ... (rest of your paragraphs) ... */}
            </div>
          </div>
          {/* Right Column - Contact */}
          <div className="slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} mb-6`}>Email</h2>
            <p className={`${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} font-normal mb-4 fade-in text-sm sm:text-base`} style={{ animationDelay: '0.5s' }}>
              Only business inquiries will be responded to.
            </p>
            <a href="mailto:microkeebs@gmail.com" className={`${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} font-normal hover:opacity-70 transition-all duration-300 smooth-bounce fade-in text-sm sm:text-base`} style={{ animationDelay: '0.7s' }}>
              microkeebs@gmail.com
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function AppContent() {
  const { isDark } = useTheme();
  const location = useLocation();

  // Determine current page from URL for Header highlighting
  const getCurrentPage = () => {
    if (location.pathname.startsWith('/rankings')) return 'rankings';
    if (location.pathname.startsWith('/contact')) return 'contact';
    return 'builds'; // Default to builds for root and build detail pages
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'}`}>
      {/* You will need to update Header to use <Link> instead of onNavigate */}
      <Header currentPage={getCurrentPage()} />
      <main>
        <Routes>
          <Route path="/" element={<BuildGallery builds={buildsWithSlugs} />} />
          <Route path="/rankings" element={<Rankings builds={buildsWithSlugs} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/:slug" element={<BuildDetail builds={buildsWithSlugs} />} />
        </Routes>
      </main>
      <ThemeToggle />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/microkeebs">
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;