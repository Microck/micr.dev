import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { adminFetch } from './api';
import { usePendingChanges } from './use-pending-changes';

interface Rankings {
  all: string[];
  look: string[];
  sound: string[];
  feel: string[];
  mechanical: string[];
  electrocapacitive: string[];
}

interface Build {
  id: string;
  title: string;
}

interface RankingsEditorProps {
  builds: Build[];
}

const RANKING_CATEGORIES: { key: keyof Rankings; label: string }[] = [
  { key: 'all', label: 'Overall' },
  { key: 'look', label: 'Look' },
  { key: 'sound', label: 'Sound' },
  { key: 'feel', label: 'Feel' },
  { key: 'mechanical', label: 'Mechanical' },
  { key: 'electrocapacitive', label: 'Electrocapacitive' },
];

// Skeleton component
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-[#d9d5c9] rounded', className)} />
  );
}

export function RankingsEditor({ builds }: RankingsEditorProps) {
  const { pendingRankings, setPendingRankings } = usePendingChanges();
  const [rankings, setRankings] = useState<Rankings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<keyof Rankings>('all');

  useEffect(() => {
    let cancelled = false;

    const fetchRankings = async () => {
      try {
        const res = await adminFetch('/.netlify/functions/admin-rankings');
        const text = await res.text();
        let data;
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          throw new Error(`Server error: ${text || res.statusText}`);
        }
        if (!res.ok) throw new Error(data.error || 'Failed to fetch rankings');

        if (!cancelled) {
          setRankings(data.rankings);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load rankings');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchRankings();

    return () => {
      cancelled = true;
    };
  }, []);

  // Apply pending rankings if they exist
  useEffect(() => {
    if (pendingRankings) {
      setRankings(pendingRankings as unknown as Rankings);
    }
  }, [pendingRankings]);

  const getBuildTitle = (id: string) => {
    return builds.find(b => b.id === id)?.title || id;
  };

  const updateRankings = (newRankings: Rankings) => {
    setRankings(newRankings);
    setPendingRankings(newRankings as unknown as Record<string, string[]>);
  };

  const moveItem = (category: keyof Rankings, from: number, to: number) => {
    if (!rankings || to < 0 || to >= rankings[category].length) return;
    
    const newList = [...rankings[category]];
    const [removed] = newList.splice(from, 1);
    newList.splice(to, 0, removed);
    
    updateRankings({ ...rankings, [category]: newList });
  };

  const removeItem = (category: keyof Rankings, index: number) => {
    if (!rankings) return;
    const newList = rankings[category].filter((_, i) => i !== index);
    updateRankings({ ...rankings, [category]: newList });
  };

  const addItem = (category: keyof Rankings, buildId: string) => {
    if (!rankings || rankings[category].includes(buildId)) return;
    updateRankings({
      ...rankings,
      [category]: [...rankings[category], buildId],
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Category tabs skeleton */}
        <div className="flex flex-wrap gap-2">
          {RANKING_CATEGORIES.map(({ key }) => (
            <Skeleton key={key} className="h-9 w-24 rounded-lg" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current ranking skeleton */}
          <div className="rounded-xl p-5 bg-[#eae7dd]">
            <Skeleton className="h-5 w-32 mb-4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          </div>

          {/* Add builds skeleton */}
          <div className="rounded-xl p-5 bg-[#eae7dd]">
            <Skeleton className="h-5 w-24 mb-4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!rankings) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm bg-red-500/10 text-red-600 border border-red-500/20">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error || 'Failed to load rankings'}
      </div>
    );
  }

  const currentList = rankings[activeCategory];
  const availableBuilds = builds.filter(b => !currentList.includes(b.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#3d3a32]">Rankings</h2>
        <p className="text-sm mt-1 text-[#6b6459]">
          Drag to reorder. Changes saved on Deploy.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {RANKING_CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeCategory === key
                ? 'bg-[#5c5647] text-[#f5f3ed] shadow-sm'
                : 'text-[#6b6459] hover:text-[#3d3a32] hover:bg-[#e0dcd0]'
            )}
          >
            {label} ({rankings[key].length})
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm bg-red-500/10 text-red-600 border border-red-500/20">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current ranking */}
        <div className="rounded-xl p-5 bg-[#eae7dd]">
          <h3 className="font-semibold mb-4 text-[#3d3a32]">
            {RANKING_CATEGORIES.find(c => c.key === activeCategory)?.label} Ranking
          </h3>
          
          {currentList.length === 0 ? (
            <p className="text-sm text-[#8b8578] py-8 text-center">
              No items in this ranking
            </p>
          ) : (
            <ol className="space-y-2">
              {currentList.map((id, index) => (
                <li
                  key={id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#f5f3ed] group"
                >
                  <span className="w-7 h-7 flex items-center justify-center text-sm font-bold rounded-md bg-[#d9d5c9] text-[#5c5647]">
                    {index + 1}
                  </span>
                  <span className="flex-1 truncate text-[#3d3a32] font-medium">
                    {getBuildTitle(id)}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index > 0 && (
                      <button
                        onClick={() => moveItem(activeCategory, index, index - 1)}
                        className="p-1.5 rounded-md text-[#6b6459] hover:bg-[#e0dcd0] hover:text-[#3d3a32] transition-colors"
                        title="Move up"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                    )}
                    {index < currentList.length - 1 && (
                      <button
                        onClick={() => moveItem(activeCategory, index, index + 1)}
                        className="p-1.5 rounded-md text-[#6b6459] hover:bg-[#e0dcd0] hover:text-[#3d3a32] transition-colors"
                        title="Move down"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => removeItem(activeCategory, index)}
                      className="p-1.5 rounded-md text-[#a65d5d] hover:bg-[#f0e8e8] transition-colors"
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Add builds */}
        <div className="rounded-xl p-5 bg-[#eae7dd]">
          <h3 className="font-semibold mb-4 text-[#3d3a32]">
            Add Build
          </h3>
          
          {availableBuilds.length === 0 ? (
            <p className="text-sm text-[#8b8578] py-8 text-center">
              All builds are in this ranking
            </p>
          ) : (
            <div className="max-h-[400px] overflow-y-auto space-y-1">
              {availableBuilds.map((build) => (
                <button
                  key={build.id}
                  onClick={() => addItem(activeCategory, build.id)}
                  className="w-full text-left p-3 rounded-lg truncate transition-colors text-[#5c5647] hover:bg-[#f5f3ed] hover:text-[#3d3a32] flex items-center gap-2"
                >
                  <svg className="w-4 h-4 flex-shrink-0 text-[#6b8f5c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {build.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
