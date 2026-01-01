import { useState, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { API_BASE } from './api';

interface ImageUploaderProps {
  buildId: string;
  currentImageCount: number;
  onUpload: (paths: string[]) => void;
  disabled?: boolean;
}

export function ImageUploader({ buildId, currentImageCount, onUpload, disabled }: ImageUploaderProps) {
  const { isDark } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadSingleFile = async (file: File, index: number): Promise<string> => {
    const token = localStorage.getItem('admin_token');
    const base64 = await fileToBase64(file);

    const res = await fetch(`${API_BASE}/.netlify/functions/admin-upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ image: base64, buildId, index }),
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Server error: ${text || res.statusText}`);
    }

    if (!res.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return data.path;
  };

  const handleUpload = async (files: File[]) => {
    if (!buildId) {
      setError('Save the build first before uploading images');
      return;
    }

    // Validate all files
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        setError(`Image "${file.name}" too large. Maximum size is 10MB.`);
        return;
      }
    }

    setUploading(true);
    setError(null);
    setProgress({ current: 0, total: files.length });

    const uploadedPaths: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        setProgress({ current: i + 1, total: files.length });
        const index = currentImageCount + i;
        const path = await uploadSingleFile(files[i], index);
        uploadedPaths.push(path);
      }
      onUpload(uploadedPaths);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(Array.from(files));
    }
    // Reset input so same files can be selected again
    e.target.value = '';
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      const imageFiles: File[] = [];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            imageFiles.push(file);
          }
        }
      }
      if (imageFiles.length > 0) {
        handleUpload(imageFiles);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        handleUpload(imageFiles);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-2">
      <div
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
          disabled && 'opacity-50 cursor-not-allowed',
          uploading && 'opacity-70 cursor-wait',
          isDark
            ? 'border-gray-600 hover:border-blue-500 hover:bg-blue-500/5 text-gray-400'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-500'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={disabled || uploading}
          className="hidden"
        />
        {uploading && progress ? (
          <div className="space-y-2">
            <p>Uploading {progress.current} of {progress.total}...</p>
            <div className={cn(
              'w-full h-2 rounded-full overflow-hidden',
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            )}>
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="font-medium">Drop images here or click to upload</p>
            <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-400')}>
              Supports multiple files. Max 10MB each.
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
