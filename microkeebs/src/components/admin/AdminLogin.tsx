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

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('admin_token', data.token);
        onLogin();
      } else {
        setError(data.error || 'Login failed');
        if (data.remaining !== undefined) {
          setRemaining(data.remaining);
        }
        if (data.resetIn) {
          setError(`Too many attempts. Try again in ${Math.ceil(data.resetIn / 60)} minutes.`);
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
      isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'
    )}>
      <div className={cn(
        'w-full max-w-sm p-6 rounded-lg',
        isDark ? 'bg-[#2a2a2a]' : 'bg-[#f5f5f0]'
      )}>
        <h1 className={cn(
          'text-2xl font-bold mb-6 text-center',
          isDark ? 'text-white' : 'text-gray-900'
        )}>
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={cn(
                'w-full px-4 py-2 rounded border focus:outline-none focus:ring-2',
                isDark
                  ? 'bg-[#1c1c1c] border-gray-600 text-white focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-400'
              )}
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {remaining !== null && remaining <= 2 && (
            <p className="text-yellow-500 text-sm">
              {remaining} attempts remaining
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className={cn(
              'w-full py-2 px-4 rounded font-medium transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isDark
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            )}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
