import { useState, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  buildId: string;
  onUpload: (path: string) => void;
  disabled?: boolean;
}

export function ImageUploader({ buildId, onUpload, disabled }: ImageUploaderProps) {
  const { isDark } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!buildId) {
      setError('Save the build first before uploading images');
      return;
    }

    setUploading(true);
    setError(null);

    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('buildId', buildId);
    formData.append('index', '0'); // Will be updated by parent

    try {
      const res = await fetch('https://micr.dev/.netlify/functions/admin-upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await res.json();
      onUpload(data.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            handleUpload(file);
          }
          break;
        }
      }
    }
  };

  return (
    <div className="space-y-2">
      <div
        onPaste={handlePaste}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          disabled && 'opacity-50 cursor-not-allowed',
          uploading && 'opacity-50',
          isDark
            ? 'border-gray-600 hover:border-gray-500 text-gray-400'
            : 'border-gray-300 hover:border-gray-400 text-gray-500'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || uploading}
          className="hidden"
        />
        {uploading ? (
          <p>Uploading...</p>
        ) : (
          <p>Click or paste image to upload</p>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
