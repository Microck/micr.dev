import { useState, useEffect, ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { AdminLogin } from './AdminLogin';
import { API_BASE } from './api';
import { usePendingChanges } from './PendingChangesContext';

interface AdminLayoutProps {
  children: ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export function AdminLayout({ children, currentView, onNavigate }: AdminLayoutProps) {
  const { isDark } = useTheme();
  const { pendingImages, pendingBuilds, pendingRankings, hasChanges, clearAll } = usePendingChanges();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentBuilds, setCurrentBuilds] = useState<unknown[]>([]);
  const [currentRankings, setCurrentRankings] = useState<Record<string, string[]> | null>(null);

  useEffect(() => {
    checkAuth();
    fetchCurrentData();
  }, []);

  const fetchCurrentData = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const [buildsRes, rankingsRes] = await Promise.all([
        fetch(`${API_BASE}/.netlify/functions/admin-builds`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/.netlify/functions/admin-rankings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      
      if (buildsRes.ok) {
        const data = await buildsRes.json();
        setCurrentBuilds(data.builds || []);
      }
      if (rankingsRes.ok) {
        const data = await rankingsRes.json();
        setCurrentRankings(data.rankings || null);
      }
    } catch {
      // Ignore
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/.netlify/functions/admin-auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
      setIsAuthenticated(res.ok);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`${API_BASE}/.netlify/functions/admin-auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });
    } catch {
      // Ignore errors
    }
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  const handleDeploy = async () => {
    setDeploying(true);
    setDeployStatus('idle');
    
    try {
      const token = localStorage.getItem('admin_token');
      
      // Convert pendingBuilds Map to array
      const pendingBuildsArray = Array.from(pendingBuilds.values());
      
      const res = await fetch(`${API_BASE}/.netlify/functions/admin-deploy`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pendingImages,
          pendingBuilds: pendingBuildsArray,
          pendingRankings,
          currentBuilds,
          currentRankings,
        }),
      });
      
      if (res.ok) {
        setDeployStatus('success');
        clearAll();
        // Refresh data after deploy
        fetchCurrentData();
        setTimeout(() => setDeployStatus('idle'), 3000);
      } else {
        const data = await res.json();
        console.error('Deploy failed:', data.error);
        setDeployStatus('error');
        setTimeout(() => setDeployStatus('idle'), 3000);
      }
    } catch (err) {
      console.error('Deploy error:', err);
      setDeployStatus('error');
      setTimeout(() => setDeployStatus('idle'), 3000);
    } finally {
      setDeploying(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center',
        isDark ? 'bg-[#0f0f0f] text-white' : 'bg-gray-50 text-gray-900'
      )}>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const navItems = [
    { id: 'builds', label: 'Builds', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )},
    { id: 'rankings', label: 'Rankings', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
  ];

  return (
    <div className={cn(
      'min-h-screen',
      isDark ? 'bg-[#0f0f0f]' : 'bg-gray-50'
    )}>
      {/* Header */}
      <header className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-lg',
        isDark 
          ? 'bg-[#1a1a1a]/90 border-gray-800' 
          : 'bg-white/90 border-gray-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm',
                  isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                )}>
                  MK
                </div>
                <h1 className={cn(
                  'text-lg font-semibold',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  Admin Panel
                </h1>
              </div>
              <nav className="flex gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      currentView === item.id
                        ? isDark
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : isDark
                          ? 'text-gray-400 hover:text-white hover:bg-white/5'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              {/* Deploy Button */}
              <button
                onClick={handleDeploy}
                disabled={deploying || !hasChanges}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all relative',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  deployStatus === 'success'
                    ? 'bg-green-500 text-white'
                    : deployStatus === 'error'
                    ? 'bg-red-500 text-white'
                    : hasChanges
                    ? isDark
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                    : isDark
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-500'
                )}
              >
                {hasChanges && deployStatus === 'idle' && !deploying && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                )}
                {deploying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Deploying...
                  </>
                ) : deployStatus === 'success' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Deployed!
                  </>
                ) : deployStatus === 'error' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Failed
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {hasChanges ? `Deploy (${pendingImages.length} images)` : 'No changes'}
                  </>
                )}
              </button>
              <a
                href="#/"
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to site
              </a>
              <button
                onClick={handleLogout}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isDark
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-red-600 hover:bg-red-50'
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
