import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { API_BASE } from './api';

interface KeyboardBuild {
  id: string;
  title: string;
  youtubeTitle?: string;
  category: 'MX' | 'EC';
  timestamp: string;
  images: string[];
  youtubeUrl: string;
  specs: Record<string, string | undefined>;
}

interface BuildsListProps {
  onSelectBuild: (build: KeyboardBuild) => void;
}

export function BuildsList({ onSelectBuild }: BuildsListProps) {
  const { isDark } = useTheme();
  const [builds, setBuilds] = useState<KeyboardBuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'MX' | 'EC'>('all');

  useEffect(() => {
    fetchBuilds();
  }, []);

  const fetchBuilds = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_BASE}/.netlify/functions/admin-builds`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Server error: ${text || res.statusText}`);
      }
      if (!res.ok) throw new Error(data.error || 'Failed to fetch builds');
      setBuilds(data.builds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load builds');
    } finally {
      setLoading(false);
    }
  };

  const filteredBuilds = builds.filter((build) => {
    const matchesSearch = build.title.toLowerCase().includes(search.toLowerCase()) ||
      build.youtubeTitle?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || build.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-5 h-5 border-2 border-t-transparent rounded-full animate-spin',
            isDark ? 'border-white' : 'border-gray-900'
          )} />
          <span className={isDark ? 'text-white' : 'text-gray-900'}>Loading builds...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(
        'flex items-center gap-2 px-4 py-3 rounded-xl text-sm',
        'bg-red-500/10 text-red-500 border border-red-500/20'
      )}>
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={cn(
            'text-2xl font-bold',
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            Builds
          </h2>
          <p className={cn(
            'text-sm mt-1',
            isDark ? 'text-gray-400' : 'text-gray-500'
          )}>
            {filteredBuilds.length} of {builds.length} builds
          </p>
        </div>
        <button
          onClick={() => onSelectBuild({
            id: '',
            title: '',
            category: 'MX',
            timestamp: new Date().toISOString(),
            images: [],
            youtubeUrl: '',
            specs: {},
          })}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all',
            'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25'
          )}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Build
        </button>
      </div>

      {/* Filters */}
      <div className={cn(
        'flex gap-3 p-4 rounded-xl',
        isDark ? 'bg-[#1a1a1a]' : 'bg-white shadow-sm'
      )}>
        <div className="relative flex-1">
          <svg 
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
              isDark ? 'text-gray-500' : 'text-gray-400'
            )} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search builds..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all',
              'focus:outline-none focus:ring-0',
              isDark
                ? 'bg-[#0f0f0f] border-gray-800 text-white placeholder-gray-500 focus:border-blue-500'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
            )}
          />
        </div>
        <div className="flex rounded-lg overflow-hidden border-2 border-transparent">
          {(['all', 'MX', 'EC'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium transition-colors',
                categoryFilter === cat
                  ? 'bg-blue-500 text-white'
                  : isDark
                    ? 'bg-[#0f0f0f] text-gray-400 hover:text-white'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900'
              )}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Builds grid */}
      {filteredBuilds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBuilds.map((build) => (
            <button
              key={build.id}
              onClick={() => onSelectBuild(build)}
              className={cn(
                'text-left rounded-xl overflow-hidden transition-all group',
                isDark
                  ? 'bg-[#1a1a1a] hover:bg-[#222] ring-1 ring-gray-800 hover:ring-gray-700'
                  : 'bg-white hover:bg-gray-50 shadow-sm hover:shadow-md'
              )}
            >
              <div className="relative aspect-video overflow-hidden">
                {build.images[0] ? (
                  <img
                    src={build.images[0].replace('./', import.meta.env.BASE_URL)}
                    alt={build.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className={cn(
                    'w-full h-full flex items-center justify-center',
                    isDark ? 'bg-gray-800' : 'bg-gray-100'
                  )}>
                    <svg className={cn('w-12 h-12', isDark ? 'text-gray-700' : 'text-gray-300')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className={cn(
                  'absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-md',
                  build.category === 'MX'
                    ? 'bg-blue-500 text-white'
                    : 'bg-purple-500 text-white'
                )}>
                  {build.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className={cn(
                  'font-semibold truncate',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  {build.title || 'Untitled'}
                </h3>
                <p className={cn(
                  'text-sm mt-1',
                  isDark ? 'text-gray-500' : 'text-gray-400'
                )}>
                  {new Date(build.timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className={cn(
          'text-center py-16 rounded-xl',
          isDark ? 'bg-[#1a1a1a]' : 'bg-white'
        )}>
          <svg className={cn('w-16 h-16 mx-auto mb-4', isDark ? 'text-gray-700' : 'text-gray-300')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className={cn(
            'text-lg font-medium',
            isDark ? 'text-gray-400' : 'text-gray-500'
          )}>
            No builds found
          </p>
          <p className={cn(
            'text-sm mt-1',
            isDark ? 'text-gray-500' : 'text-gray-400'
          )}>
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
