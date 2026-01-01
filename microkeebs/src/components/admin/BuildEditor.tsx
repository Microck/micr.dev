import { useState, useEffect } from 'react';
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

  const inputClass = 'w-full px-3 py-2.5 rounded-lg border-2 transition-all focus:outline-none focus:ring-0 bg-[#f5f3ed] border-[#d9d5c9] text-[#3d3a32] placeholder-[#8b8578] focus:border-[#5c5647] disabled:opacity-50 disabled:bg-[#e0dcd0]';
  const labelClass = 'block text-sm font-medium mb-1.5 text-[#5c5647]';

  return (
    <div className="rounded-xl p-6 bg-[#eae7dd]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#3d3a32]">
          {isNew ? 'New Build' : `Edit: ${build.title}`}
        </h2>
        <button
          onClick={onCancel}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-[#6b6459] hover:text-[#3d3a32] hover:bg-[#d9d5c9] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          <div className="flex items-center justify-between mb-3">
            <label className={labelClass}>Specs</label>
            <button
              type="button"
              onClick={addSpecKey}
              className="text-sm px-3 py-1.5 rounded-lg text-[#5c5647] hover:bg-[#d9d5c9] transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Spec
            </button>
          </div>
          <div className="space-y-2">
            {specKeys.map((key) => (
              <div key={key} className="flex gap-2">
                <div className="w-32 flex-shrink-0 px-3 py-2.5 rounded-lg text-sm bg-[#d9d5c9] text-[#5c5647] font-medium">
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
                  className="p-2.5 rounded-lg text-[#a65d5d] hover:bg-[#f0e8e8] transition-colors"
                  title="Remove spec"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
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
          <div className="mt-3">
            <ImageUploader
              buildId={formData.id}
              currentImageCount={formData.images.length}
              onUpload={handleImageUpload}
              disabled={!formData.id}
            />
          </div>
        </div>

        {/* Error/Success */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm bg-red-500/10 text-red-600 border border-red-500/20">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm bg-green-500/10 text-green-700 border border-green-500/20">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-[#d9d5c9]">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg font-medium disabled:opacity-50 bg-[#5c5647] hover:bg-[#4a463a] text-white transition-colors"
          >
            {saving ? 'Saving...' : 'Save Build'}
          </button>
          {!isNew && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-5 py-2.5 rounded-lg font-medium bg-[#a65d5d] hover:bg-[#8f4f4f] text-white transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
