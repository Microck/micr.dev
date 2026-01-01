import { useState, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { usePendingChanges } from './PendingChangesContext';

interface ImageUploaderProps {
  buildId: string;
  currentImageCount: number;
  onUpload: (paths: string[]) => void;
  disabled?: boolean;
}

// Max size before compression (~4MB)
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const COMPRESS_MAX_WIDTH = 2400;
const COMPRESS_QUALITY = 0.85;

export function ImageUploader({ buildId, currentImageCount, onUpload, disabled }: ImageUploaderProps) {
  const { isDark } = useTheme();
  const { addPendingImage } = usePendingChanges();
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress image if needed and return base64
  const processImage = async (file: File): Promise<{ base64: string; blob: Blob }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        let { width, height } = img;
        
        // Scale down if too wide or file too large
        if (width > COMPRESS_MAX_WIDTH || file.size > MAX_FILE_SIZE) {
          const scale = Math.min(COMPRESS_MAX_WIDTH / width, 1);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }
            
            const reader = new FileReader();
            reader.onload = () => {
              const dataUrl = reader.result as string;
              const base64 = dataUrl.split(',')[1];
              resolve({ base64, blob });
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          },
          'image/jpeg',
          COMPRESS_QUALITY
        );
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFiles = async (files: File[]) => {
    if (!buildId) {
      setError('Save the build first before adding images');
      return;
    }

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError(`"${file.name}" is not an image`);
        return;
      }
    }

    setProcessing(true);
    setError(null);
    setProgress({ current: 0, total: files.length });

    const newPaths: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        setProgress({ current: i + 1, total: files.length });
        const index = currentImageCount + i;
        
        const { base64, blob } = await processImage(files[i]);
        const localUrl = URL.createObjectURL(blob);
        
        // Store in pending changes
        addPendingImage({
          buildId,
          index,
          base64,
          localUrl,
        });
        
        // Add path to build's images array
        const path = `./images/${buildId}/${index}.webp`;
        newPaths.push(path);
      }
      
      onUpload(newPaths);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process images');
    } finally {
      setProcessing(false);
      setProgress(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(Array.from(files));
    }
    e.target.value = '';
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      const imageFiles: File[] = [];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) imageFiles.push(file);
        }
      }
      if (imageFiles.length > 0) {
        handleFiles(imageFiles);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        handleFiles(imageFiles);
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
        onClick={() => !disabled && !processing && fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
          disabled && 'opacity-50 cursor-not-allowed',
          processing && 'opacity-70 cursor-wait',
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
          disabled={disabled || processing}
          className="hidden"
        />
        {processing && progress ? (
          <div className="space-y-2">
            <p>Processing {progress.current} of {progress.total}...</p>
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
            <p className="font-medium">Drop images here or click to add</p>
            <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-400')}>
              Images are saved when you click Deploy
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
