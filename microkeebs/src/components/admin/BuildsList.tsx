import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { adminFetch } from './api';

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

// Skeleton component
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-[#d9d5c9] rounded', className)} />
  );
}

// Build card skeleton
function BuildCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#eae7dd] ring-1 ring-[#d9d5c9]">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="p-4">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function BuildsList({ onSelectBuild }: BuildsListProps) {
  const [builds, setBuilds] = useState<KeyboardBuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'MX' | 'EC'>('all');

  useEffect(() => {
    fetchBuilds();
  }, []);

  const fetchBuilds = async () => {
    try {
      const res = await adminFetch('/.netlify/functions/admin-builds');
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

  if (error) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm bg-red-500/10 text-red-600 border border-red-500/20">
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
          <h2 className="text-2xl font-bold text-[#3d3a32]">
            Builds
          </h2>
          <p className="text-sm mt-1 text-[#6b6459]">
            {loading ? (
              <Skeleton className="h-4 w-24 inline-block" />
            ) : (
              `${filteredBuilds.length} of ${builds.length} builds`
            )}
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all bg-[#5c5647] hover:bg-[#4a463a] text-[#f5f3ed] shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Build
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 p-4 rounded-xl bg-[#eae7dd]">
        <div className="relative flex-1">
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b8578]" 
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
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-0 bg-[#f5f3ed] border-[#d9d5c9] text-[#3d3a32] placeholder-[#8b8578] focus:border-[#5c5647]"
          />
        </div>
        <div className="flex rounded-lg overflow-hidden">
          {(['all', 'MX', 'EC'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium transition-colors',
                categoryFilter === cat
                  ? 'bg-[#5c5647] text-[#f5f3ed]'
                  : 'bg-[#f5f3ed] text-[#6b6459] hover:text-[#3d3a32]'
              )}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Builds grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <BuildCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredBuilds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBuilds.map((build) => (
            <BuildCard 
              key={build.id} 
              build={build} 
              onClick={() => onSelectBuild(build)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-xl bg-[#eae7dd]">
          <svg className="w-16 h-16 mx-auto mb-4 text-[#d9d5c9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium text-[#6b6459]">
            No builds found
          </p>
          <p className="text-sm mt-1 text-[#8b8578]">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}

// Separate component for build card with image loading state
function BuildCard({ build, onClick }: { build: KeyboardBuild; onClick: () => void }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageSrc = build.images[0]?.replace('./', import.meta.env.BASE_URL);

  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl overflow-hidden transition-all group bg-[#eae7dd] hover:bg-[#e0dcd0] ring-1 ring-[#d9d5c9] hover:ring-[#c9c5b9]"
    >
      <div className="relative aspect-video overflow-hidden bg-[#d9d5c9]">
        {imageSrc && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-[#d9d5c9]" />
            )}
            <img
              src={imageSrc}
              alt={build.title}
              className={cn(
                'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300',
                !imageLoaded && 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#e0dcd0]">
            <svg className="w-12 h-12 text-[#c9c5b9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className={cn(
          'absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-md',
          build.category === 'MX'
            ? 'bg-[#5c8f6b] text-white'
            : 'bg-[#8f5c7a] text-white'
        )}>
          {build.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold truncate text-[#3d3a32]">
          {build.title || 'Untitled'}
        </h3>
        <p className="text-sm mt-1 text-[#8b8578]">
          {new Date(build.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </p>
      </div>
    </button>
  );
}
