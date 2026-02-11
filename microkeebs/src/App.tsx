import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { Header } from './components/Header';
import { BuildGallery } from './components/BuildGallery';
import { BuildDetail } from './components/BuildDetail';
import { Rankings } from './components/Rankings';
import { Blog } from './components/Blog';
import { BlogPost } from './components/BlogPost';
import { Commissions } from './components/Commissions';
import { Contact } from './components/Contact';
import { ThemeToggle } from './components/ThemeToggle';
import { MobilePopup } from './components/MobilePopup';
import { SmoothScroll } from './components/SmoothScroll';
import { PageTransitions } from './components/PageTransitions';
import { TargetCursor } from './components/TargetCursor';
import { DebugCursor } from './components/DebugCursor';
import { AdminPage } from './components/admin';
import { KeyboardBuild } from './types/Build';
import type { BlogPost as BlogPostType } from './types/BlogPost';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { findBuildBySlug } from './utils/slugUtils';
import { getPostBySlug } from './utils/blog';
import builds from './data/builds.json';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function AppContent() {
  const [currentPage, setCurrentPage] = useState('builds');
  const [selectedBuild, setSelectedBuild] = useState<KeyboardBuild | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPostType | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const { isDark } = useTheme();

  // Keyboard shortcut for debug mode (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setDebugMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle URL-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      // Handle admin route
      if (hash.startsWith('#/admin')) {
        setCurrentPage('admin');
        setSelectedBuild(null);
        setSelectedPost(null);
        return;
      }

      // Handle blog post routes: #/blog/:slug
      if (hash.startsWith('#/blog/') && hash !== '#/blog/') {
        const slug = hash.replace('#/blog/', '');
        const post = getPostBySlug(slug);
        if (post) {
          setSelectedPost(post);
          setCurrentPage('blog');
          setSelectedBuild(null);
        } else {
          // Post not found, go to blog listing
          setSelectedPost(null);
          setCurrentPage('blog');
          setSelectedBuild(null);
        }
        return;
      }

      if (hash.startsWith('#/builds/')) {
        const slugPath = hash.replace('#/builds/', '');
        const parts = slugPath.split('/');
        const baseSlug = parts[0];
        const counter = parts[1];

        const build = findBuildBySlug(baseSlug, counter, builds as unknown as KeyboardBuild[]);
        if (build) {
          setSelectedBuild(build);
          setCurrentPage('builds');
          setSelectedPost(null);
        }
      } else if (hash === '#/rankings') {
        setCurrentPage('rankings');
        setSelectedBuild(null);
        setSelectedPost(null);
      } else if (hash === '#/blog') {
        setCurrentPage('blog');
        setSelectedBuild(null);
        setSelectedPost(null);
      } else if (hash === '#/commissions') {
        setCurrentPage('commissions');
        setSelectedBuild(null);
        setSelectedPost(null);
      } else if (hash === '#/contact') {
        setCurrentPage('contact');
        setSelectedBuild(null);
        setSelectedPost(null);
      } else {
        setCurrentPage('builds');
        setSelectedBuild(null);
        setSelectedPost(null);
      }
    };

    // Initial load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const showScrollbarPages = ['builds', 'blog', 'commissions', 'contact'];
    if (showScrollbarPages.includes(currentPage)) {
      document.body.classList.add('show-scrollbar');
    } else {
      document.body.classList.remove('show-scrollbar');
    }

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, [currentPage, selectedBuild, selectedPost]);

  const handleNavigate = (page: string) => {
    if (currentPage !== page) {
      // Update URL with PageTransitions
      const newHash = `#/${page}`;
      window.location.hash = newHash;
    }
  };

  const handleBuildSelect = (build: KeyboardBuild) => {
    const baseSlug = build.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const sameTitleBuilds = builds
      .filter(b => b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === baseSlug)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const index = sameTitleBuilds.findIndex(b => b.id === build.id);
    const counter = sameTitleBuilds.length > 1 ? `/${index + 1}` : '';

    window.location.hash = `#/builds/${baseSlug}${counter}`;
  };

  const handlePostSelect = (post: BlogPostType) => {
    window.location.hash = `#/blog/${post.slug}`;
  };

  const handleBackToGallery = () => {
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(0, false);
      smoother.paused(true);
    }
    window.scrollTo(0, 0);
    window.location.hash = '#/builds';

    setTimeout(() => {
      if (smoother) {
        smoother.paused(false);
        smoother.scrollTo(0, false);
      }
      ScrollTrigger.refresh(true);
    }, 100);
  };

  const handleBackToBlog = () => {
    window.scrollTo(0, 0);
    window.location.hash = '#/blog';
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

    if (selectedPost && currentPage === 'blog') {
      return (
        <BlogPost
          post={selectedPost}
          onBack={handleBackToBlog}
        />
      );
    }

    switch (currentPage) {
      case 'admin':
        return <AdminPage />;
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
      case 'blog':
        return <Blog onPostClick={handlePostSelect} />;
      case 'commissions':
        return <Commissions />;
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
    <>
      <SmoothScroll>
        <div className={`min-h-screen ${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} relative`}>
          <PageTransitions currentPage={currentPage}>
            <div className="relative z-10">
              <Header currentPage={currentPage} onNavigate={handleNavigate} />
              <main>
                {renderContent()}
              </main>
            </div>
          </PageTransitions>
        </div>
      </SmoothScroll>
      <ThemeToggle />
      <MobilePopup />
      {!debugMode && <TargetCursor targetSelector="button.nav-item.px-3, svg, rect, svg.iconify.iconify--mingcute, div.w-4.h-4, select.border.px-3, button.px-4.py-1, img.gallery-media__image, button.fixed.bottom-6, div.w-full.aspect-video" />}
      {debugMode && <DebugCursor onClose={() => setDebugMode(false)} />}
    </>
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
