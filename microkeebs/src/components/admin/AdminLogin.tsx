import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { API_BASE } from './api';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const { isDark } = useTheme();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/.netlify/functions/admin-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include',
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        setError(`Server error: ${text || res.statusText}`);
        return;
      }

      if (res.ok) {
        localStorage.setItem('admin_token', data.token);
        onLogin();
      } else {
        setError(data.error || 'Login failed');
        if (data.remaining !== undefined) {
          setRemaining(data.remaining);
        }
        if (data.resetIn) {
          const hours = Math.ceil(data.resetIn / 3600);
          setError(`Too many attempts. Try again in ${hours} hour${hours > 1 ? 's' : ''}.`);
        }
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center p-4',
      isDark ? 'bg-[#0f0f0f]' : 'bg-gray-50'
    )}>
      <div className={cn(
        'w-full max-w-md p-8 rounded-2xl shadow-2xl',
        isDark 
          ? 'bg-[#1a1a1a] shadow-black/50' 
          : 'bg-white shadow-gray-200/50'
      )}>
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl',
            isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
          )}>
            MK
          </div>
        </div>

        <h1 className={cn(
          'text-2xl font-bold mb-2 text-center',
          isDark ? 'text-white' : 'text-gray-900'
        )}>
          Admin Access
        </h1>
        <p className={cn(
          'text-sm mb-8 text-center',
          isDark ? 'text-gray-400' : 'text-gray-500'
        )}>
          Enter your password to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={cn(
              'block text-sm font-medium mb-2',
              isDark ? 'text-gray-300' : 'text-gray-700'
            )}>
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 transition-all',
                  'focus:outline-none focus:ring-0',
                  isDark
                    ? 'bg-[#0f0f0f] border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                )}
                disabled={loading}
                autoFocus
              />
              <div className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                isDark ? 'text-gray-500' : 'text-gray-400'
              )}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          {error && (
            <div className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-xl text-sm',
              'bg-red-500/10 text-red-500 border border-red-500/20'
            )}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {remaining !== null && remaining <= 2 && !error?.includes('Too many') && (
            <div className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-xl text-sm',
              'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
            )}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {remaining} attempt{remaining !== 1 ? 's' : ''} remaining
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className={cn(
              'w-full py-3 px-4 rounded-xl font-semibold transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center justify-center gap-2',
              isDark
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25'
            )}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </>
            )}
          </button>
        </form>

        <p className={cn(
          'text-xs text-center mt-6',
          isDark ? 'text-gray-500' : 'text-gray-400'
        )}>
          Protected area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
