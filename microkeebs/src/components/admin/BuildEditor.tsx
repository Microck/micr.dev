import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { ImageUploader } from './ImageUploader';
import { ImageGallery } from './ImageGallery';
import { usePendingChanges } from './PendingChangesContext';

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

interface BuildEditorProps {
  build: KeyboardBuild;
  onSave: (build: KeyboardBuild) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

const DEFAULT_SPEC_KEYS = [
  'Keyboard',
  'Keycaps',
  'Switches',
  'Lube',
  'Films',
  'Springs',
  'Plate',
  'Mount',
  'Stabilizers',
  'PCB',
  'Artisan',
  'Others',
];

export function BuildEditor({ build, onSave, onDelete, onCancel }: BuildEditorProps) {
  const { isDark } = useTheme();
  const { setPendingBuild, deletePendingBuild } = usePendingChanges();
  const [formData, setFormData] = useState<KeyboardBuild>(build);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [specKeys, setSpecKeys] = useState<string[]>([]);

  const isNew = !build.id;

  useEffect(() => {
    // Initialize spec keys from build or defaults
    const existingKeys = Object.keys(build.specs).filter(k => build.specs[k] !== undefined);
    setSpecKeys(existingKeys.length > 0 ? existingKeys : DEFAULT_SPEC_KEYS);
  }, [build]);

  const handleChange = (field: keyof KeyboardBuild, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs, [key]: value || undefined },
    }));
  };

  const addSpecKey = () => {
    const newKey = prompt('Enter spec name:');
    if (newKey && !specKeys.includes(newKey)) {
      setSpecKeys([...specKeys, newKey]);
    }
  };

  const removeSpecKey = (key: string) => {
    setSpecKeys(specKeys.filter(k => k !== key));
    setFormData(prev => {
      const newSpecs = { ...prev.specs };
      delete newSpecs[key];
      return { ...prev, specs: newSpecs };
    });
  };

  const handleImageUpload = (paths: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...paths],
    }));
  };

  const handleImageReorder = (newImages: string[]) => {
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleImageDelete = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleImageRename = (index: number, newPath: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? newPath : img),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id || !formData.title || !formData.category) {
      setError('ID, title, and category are required');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Save to pending changes (will be committed on Deploy)
      setPendingBuild({
        ...formData,
        isNew,
      });

      setSuccess('Build saved! Click Deploy to publish.');
      setTimeout(() => setSuccess(null), 3000);
      onSave(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this build?')) return;

    try {
      // Mark as deleted in pending changes (will be removed on Deploy)
      deletePendingBuild(formData.id);
      onDelete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const inputClass = cn(
    'w-full px-3 py-2 rounded border',
    isDark
      ? 'bg-[#2a2a2a] border-gray-600 text-white'
      : 'bg-white border-gray-300 text-gray-900'
  );

  const labelClass = cn(
    'block text-sm font-medium mb-1',
    isDark ? 'text-gray-300' : 'text-gray-700'
  );

  return (
    <div className={cn(
      'rounded-lg p-4',
      isDark ? 'bg-[#2a2a2a]' : 'bg-white'
    )}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={cn(
          'text-xl font-bold',
          isDark ? 'text-white' : 'text-gray-900'
        )}>
          {isNew ? 'New Build' : `Edit: ${build.title}`}
        </h2>
        <button
          onClick={onCancel}
          className={cn(
            'px-3 py-1 rounded text-sm',
            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          )}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>ID *</label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => handleChange('id', e.target.value)}
              className={inputClass}
              disabled={!isNew}
              placeholder="e.g., XdNu4YX4PSE"
            />
          </div>
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={inputClass}
              placeholder="e.g., Leopold FC750R"
            />
          </div>
          <div>
            <label className={labelClass}>YouTube Title</label>
            <input
              type="text"
              value={formData.youtubeTitle || ''}
              onChange={(e) => handleChange('youtubeTitle', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={inputClass}
            >
              <option value="MX">MX</option>
              <option value="EC">EC</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>YouTube URL</label>
            <input
              type="url"
              value={formData.youtubeUrl}
              onChange={(e) => handleChange('youtubeUrl', e.target.value)}
              className={inputClass}
              placeholder="https://youtu.be/..."
            />
          </div>
          <div>
            <label className={labelClass}>Timestamp</label>
            <input
              type="datetime-local"
              value={formData.timestamp.slice(0, 16)}
              onChange={(e) => handleChange('timestamp', new Date(e.target.value).toISOString())}
              className={inputClass}
            />
          </div>
        </div>

        {/* Specs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClass}>Specs</label>
            <button
              type="button"
              onClick={addSpecKey}
              className={cn(
                'text-sm px-2 py-1 rounded',
                isDark ? 'text-blue-400 hover:bg-blue-900/30' : 'text-blue-600 hover:bg-blue-100'
              )}
            >
              + Add Spec
            </button>
          </div>
          <div className="space-y-2">
            {specKeys.map((key) => (
              <div key={key} className="flex gap-2">
                <div className={cn(
                  'w-32 flex-shrink-0 px-3 py-2 rounded text-sm',
                  isDark ? 'bg-[#1c1c1c] text-gray-400' : 'bg-gray-100 text-gray-600'
                )}>
                  {key}
                </div>
                <input
                  type="text"
                  value={formData.specs[key] || ''}
                  onChange={(e) => handleSpecChange(key, e.target.value)}
                  className={cn(inputClass, 'flex-1')}
                  placeholder="-"
                />
                <button
                  type="button"
                  onClick={() => removeSpecKey(key)}
                  className="text-red-500 hover:text-red-400 px-2"
                  title="Remove spec"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className={labelClass}>Images</label>
          <ImageGallery
            buildId={formData.id}
            images={formData.images}
            onReorder={handleImageReorder}
            onDelete={handleImageDelete}
            onRename={handleImageRename}
          />
          <div className="mt-2">
            <ImageUploader
              buildId={formData.id}
              currentImageCount={formData.images.length}
              onUpload={handleImageUpload}
              disabled={!formData.id}
            />
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-600">
          <button
            type="submit"
            disabled={saving}
            className={cn(
              'px-4 py-2 rounded font-medium',
              'disabled:opacity-50',
              isDark
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            )}
          >
            {saving ? 'Saving...' : 'Save Build'}
          </button>
          {!isNew && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className={cn(
                'px-4 py-2 rounded font-medium',
                isDark
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              )}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
