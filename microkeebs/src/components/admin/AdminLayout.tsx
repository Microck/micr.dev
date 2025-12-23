import { useState, useEffect, ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { AdminLogin } from './AdminLogin';

interface AdminLayoutProps {
  children: ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export function AdminLayout({ children, currentView, onNavigate }: AdminLayoutProps) {
  const { isDark } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const res = await fetch('/.netlify/functions/admin-auth/verify', {
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
      await fetch('/.netlify/functions/admin-auth/logout', {
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

  if (isAuthenticated === null) {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center',
        isDark ? 'bg-[#1c1c1c] text-white' : 'bg-[#a7a495] text-gray-900'
      )}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const navItems = [
    { id: 'builds', label: 'Builds' },
    { id: 'rankings', label: 'Rankings' },
  ];

  return (
    <div className={cn(
      'min-h-screen',
      isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'
    )}>
      {/* Header */}
      <header className={cn(
        'border-b px-4 py-3 flex items-center justify-between',
        isDark ? 'bg-[#2a2a2a] border-gray-700' : 'bg-[#f5f5f0] border-gray-300'
      )}>
        <div className="flex items-center gap-6">
          <h1 className={cn(
            'text-xl font-bold',
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            Admin
          </h1>
          <nav className="flex gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                  currentView === item.id
                    ? isDark
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-200'
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#/"
            className={cn(
              'text-sm',
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Back to site
          </a>
          <button
            onClick={handleLogout}
            className={cn(
              'px-3 py-1.5 rounded text-sm font-medium',
              isDark
                ? 'text-red-400 hover:bg-red-900/30'
                : 'text-red-600 hover:bg-red-100'
            )}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="p-4">
        {children}
      </main>
    </div>
  );
}
