import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { usePendingChanges } from './use-pending-changes';
import { getBuildImagePath } from './api';

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
        const path = getBuildImagePath(buildId, index);
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
          'border-[#c9c5b9] hover:border-[#5c5647] hover:bg-[#f5f3ed] text-[#6b6459]'
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
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-[#5c5647] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#5c5647] font-medium">Processing {progress.current} of {progress.total}...</p>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden bg-[#d9d5c9]">
              <div 
                className="h-full bg-[#5c5647] transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-6 h-6 text-[#8b8578]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="font-medium text-[#5c5647]">Drop images here or click to add</p>
            <p className="text-sm text-[#8b8578]">
              Images are saved when you click Deploy
            </p>
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-red-500/10 text-red-600 border border-red-500/20">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
