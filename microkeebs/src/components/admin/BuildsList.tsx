import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

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
      const res = await fetch('/.netlify/functions/admin-builds', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch builds');
      const data = await res.json();
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
    return <div className={cn('p-4', isDark ? 'text-white' : 'text-gray-900')}>Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search builds..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            'px-3 py-2 rounded border flex-1 min-w-[200px]',
            isDark
              ? 'bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          )}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as 'all' | 'MX' | 'EC')}
          className={cn(
            'px-3 py-2 rounded border',
            isDark
              ? 'bg-[#2a2a2a] border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          )}
        >
          <option value="all">All Categories</option>
          <option value="MX">MX</option>
          <option value="EC">EC</option>
        </select>
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
            'px-4 py-2 rounded font-medium',
            isDark
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          )}
        >
          + New Build
        </button>
      </div>

      {/* Build count */}
      <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
        {filteredBuilds.length} builds
      </p>

      {/* Builds grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBuilds.map((build) => (
          <button
            key={build.id}
            onClick={() => onSelectBuild(build)}
            className={cn(
              'text-left p-3 rounded-lg border transition-colors',
              isDark
                ? 'bg-[#2a2a2a] border-gray-700 hover:border-gray-500'
                : 'bg-white border-gray-200 hover:border-gray-400'
            )}
          >
            {build.images[0] && (
              <img
                src={build.images[0].replace('./', '/')}
                alt={build.title}
                className="w-full aspect-video object-cover rounded mb-2"
              />
            )}
            <h3 className={cn(
              'font-medium truncate',
              isDark ? 'text-white' : 'text-gray-900'
            )}>
              {build.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                'text-xs px-2 py-0.5 rounded',
                build.category === 'MX'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-purple-500/20 text-purple-400'
              )}>
                {build.category}
              </span>
              <span className={cn(
                'text-xs',
                isDark ? 'text-gray-500' : 'text-gray-400'
              )}>
                {new Date(build.timestamp).toLocaleDateString()}
              </span>
            </div>
          </button>
        ))}
      </div>

      {filteredBuilds.length === 0 && (
        <p className={cn(
          'text-center py-8',
          isDark ? 'text-gray-500' : 'text-gray-400'
        )}>
          No builds found
        </p>
      )}
    </div>
  );
}
