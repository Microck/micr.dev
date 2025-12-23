import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

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

export function RankingsEditor({ builds }: RankingsEditorProps) {
  const { isDark } = useTheme();
  const [rankings, setRankings] = useState<Rankings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<keyof Rankings>('all');

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('https://micr.dev/.netlify/functions/admin-rankings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch rankings');
      const data = await res.json();
      setRankings(data.rankings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rankings');
    } finally {
      setLoading(false);
    }
  };

  const getBuildTitle = (id: string) => {
    return builds.find(b => b.id === id)?.title || id;
  };

  const moveItem = (category: keyof Rankings, from: number, to: number) => {
    if (!rankings || to < 0 || to >= rankings[category].length) return;
    
    const newList = [...rankings[category]];
    const [removed] = newList.splice(from, 1);
    newList.splice(to, 0, removed);
    
    setRankings({ ...rankings, [category]: newList });
  };

  const removeItem = (category: keyof Rankings, index: number) => {
    if (!rankings) return;
    const newList = rankings[category].filter((_, i) => i !== index);
    setRankings({ ...rankings, [category]: newList });
  };

  const addItem = (category: keyof Rankings, buildId: string) => {
    if (!rankings || rankings[category].includes(buildId)) return;
    setRankings({
      ...rankings,
      [category]: [...rankings[category], buildId],
    });
  };

  const handleSave = async () => {
    if (!rankings) return;
    
    setSaving(true);
    setError(null);

    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('https://micr.dev/.netlify/functions/admin-rankings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rankings }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={cn('p-4', isDark ? 'text-white' : 'text-gray-900')}>Loading...</div>;
  }

  if (!rankings) {
    return <div className="p-4 text-red-500">{error || 'Failed to load rankings'}</div>;
  }

  const currentList = rankings[activeCategory];
  const availableBuilds = builds.filter(b => !currentList.includes(b.id));

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {RANKING_CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={cn(
              'px-3 py-1.5 rounded text-sm font-medium transition-colors',
              activeCategory === key
                ? isDark
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : isDark
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-200'
            )}
          >
            {label} ({rankings[key].length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Current ranking */}
        <div className={cn(
          'rounded-lg p-4',
          isDark ? 'bg-[#2a2a2a]' : 'bg-white'
        )}>
          <h3 className={cn(
            'font-medium mb-3',
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            {RANKING_CATEGORIES.find(c => c.key === activeCategory)?.label} Ranking
          </h3>
          
          {currentList.length === 0 ? (
            <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-400')}>
              No items in this ranking
            </p>
          ) : (
            <ol className="space-y-1">
              {currentList.map((id, index) => (
                <li
                  key={id}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded',
                    isDark ? 'bg-[#1c1c1c]' : 'bg-gray-50'
                  )}
                >
                  <span className={cn(
                    'w-6 text-center text-sm font-medium',
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    {index + 1}
                  </span>
                  <span className={cn(
                    'flex-1 truncate',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}>
                    {getBuildTitle(id)}
                  </span>
                  <div className="flex gap-1">
                    {index > 0 && (
                      <button
                        onClick={() => moveItem(activeCategory, index, index - 1)}
                        className="text-gray-400 hover:text-white px-1"
                      >
                        ↑
                      </button>
                    )}
                    {index < currentList.length - 1 && (
                      <button
                        onClick={() => moveItem(activeCategory, index, index + 1)}
                        className="text-gray-400 hover:text-white px-1"
                      >
                        ↓
                      </button>
                    )}
                    <button
                      onClick={() => removeItem(activeCategory, index)}
                      className="text-red-400 hover:text-red-300 px-1"
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Add builds */}
        <div className={cn(
          'rounded-lg p-4',
          isDark ? 'bg-[#2a2a2a]' : 'bg-white'
        )}>
          <h3 className={cn(
            'font-medium mb-3',
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            Add Build
          </h3>
          
          {availableBuilds.length === 0 ? (
            <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-400')}>
              All builds are in this ranking
            </p>
          ) : (
            <div className="max-h-[300px] overflow-y-auto space-y-1">
              {availableBuilds.map((build) => (
                <button
                  key={build.id}
                  onClick={() => addItem(activeCategory, build.id)}
                  className={cn(
                    'w-full text-left p-2 rounded truncate transition-colors',
                    isDark
                      ? 'hover:bg-[#1c1c1c] text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  )}
                >
                  + {build.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error and Save */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <button
        onClick={handleSave}
        disabled={saving}
        className={cn(
          'px-4 py-2 rounded font-medium',
          'disabled:opacity-50',
          isDark
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        )}
      >
        {saving ? 'Saving...' : 'Save Rankings'}
      </button>
    </div>
  );
}
