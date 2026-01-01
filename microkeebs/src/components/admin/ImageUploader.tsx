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

interface DebugLog {
  time: string;
  type: 'info' | 'error' | 'success';
  message: string;
  details?: string;
}

// Max size for base64 payload (~4MB file = ~5.3MB base64, safe for Netlify's ~6MB limit)
const MAX_FILE_SIZE_FOR_UPLOAD = 4 * 1024 * 1024;
const COMPRESS_MAX_WIDTH = 2400;
const COMPRESS_QUALITY = 0.85;

export function ImageUploader({ buildId, currentImageCount, onUpload, disabled }: ImageUploaderProps) {
  const { isDark } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (type: DebugLog['type'], message: string, details?: string) => {
    const time = new Date().toLocaleTimeString();
    setDebugLogs(prev => [...prev, { time, type, message, details }]);
  };

  const clearLogs = () => setDebugLogs([]);

  // Compress image client-side if too large
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        let { width, height } = img;
        
        // Scale down if too wide
        if (width > COMPRESS_MAX_WIDTH) {
          height = (height * COMPRESS_MAX_WIDTH) / width;
          width = COMPRESS_MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', COMPRESS_QUALITY);
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

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
    addLog('info', `Processing ${file.name}...`, `Size: ${(file.size / 1024).toFixed(1)}KB, Type: ${file.type}`);
    
    let base64: string;
    
    // Compress if file is too large for Netlify's payload limit
    if (file.size > MAX_FILE_SIZE_FOR_UPLOAD) {
      addLog('info', `File too large, compressing...`, `Original: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      base64 = await compressImage(file);
      addLog('info', `Compressed`, `New base64 length: ${base64.length} chars (~${(base64.length * 0.75 / 1024 / 1024).toFixed(2)}MB)`);
    } else {
      base64 = await fileToBase64(file);
      addLog('info', `Base64 ready`, `Length: ${base64.length} chars`);
    }

    const requestBody = { image: base64, buildId, index };
    addLog('info', `Sending request...`, `URL: ${API_BASE}/.netlify/functions/admin-upload\nBuildId: ${buildId}\nIndex: ${index}\nToken: ${token ? token.slice(0, 10) + '...' : 'MISSING'}`);

    const res = await fetch(`${API_BASE}/.netlify/functions/admin-upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    addLog('info', `Response received`, `Status: ${res.status} ${res.statusText}`);

    const text = await res.text();
    addLog('info', `Response body`, text.slice(0, 500) + (text.length > 500 ? '...' : ''));

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      addLog('error', `JSON parse failed`, `Error: ${e}\nRaw text: ${text.slice(0, 200)}`);
      throw new Error(`Server error: ${text || res.statusText}`);
    }

    if (!res.ok) {
      addLog('error', `Upload failed`, `Error: ${data.error || 'Unknown'}\nFull response: ${JSON.stringify(data, null, 2)}`);
      throw new Error(data.error || 'Upload failed');
    }

    addLog('success', `Upload successful`, `Path: ${data.path}`);
    return data.path;
  };

  const handleUpload = async (files: File[]) => {
    if (!buildId) {
      setError('Save the build first before uploading images');
      addLog('error', 'No buildId', 'Save the build first');
      return;
    }

    addLog('info', `Starting upload of ${files.length} file(s)`, `BuildId: ${buildId}, Current count: ${currentImageCount}`);

    // Validate all files
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        setError(`Image "${file.name}" too large. Maximum size is 10MB.`);
        addLog('error', `File too large: ${file.name}`, `Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
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
        addLog('info', `Processing file ${i + 1}/${files.length}`, `Name: ${files[i].name}, Index: ${index}`);
        const path = await uploadSingleFile(files[i], index);
        uploadedPaths.push(path);
      }
      addLog('success', `All uploads complete`, `Paths: ${uploadedPaths.join(', ')}`);
      onUpload(uploadedPaths);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
      addLog('error', `Upload error`, `${err}`);
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
      
      {/* Debug Panel Toggle */}
      <button
        type="button"
        onClick={() => setShowDebug(!showDebug)}
        className={cn(
          'text-xs px-2 py-1 rounded',
          isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-200 text-gray-600 hover:text-gray-900'
        )}
      >
        {showDebug ? 'Hide' : 'Show'} Debug Log
      </button>

      {/* Debug Panel */}
      {showDebug && (
        <div className={cn(
          'rounded-lg p-3 text-xs font-mono max-h-80 overflow-auto',
          isDark ? 'bg-black text-gray-300' : 'bg-gray-900 text-gray-300'
        )}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500">Debug Log ({debugLogs.length} entries)</span>
            <button
              type="button"
              onClick={clearLogs}
              className="text-red-400 hover:text-red-300"
            >
              Clear
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-gray-500 border-b border-gray-700 pb-2">
              API_BASE: {API_BASE || '(empty)'}<br />
              BuildId: {buildId || '(none)'}<br />
              CurrentImageCount: {currentImageCount}<br />
              Token: {localStorage.getItem('admin_token')?.slice(0, 15) || '(none)'}...
            </div>
            {debugLogs.length === 0 ? (
              <p className="text-gray-500">No logs yet. Try uploading an image.</p>
            ) : (
              debugLogs.map((log, i) => (
                <div key={i} className={cn(
                  'border-l-2 pl-2',
                  log.type === 'error' && 'border-red-500 text-red-400',
                  log.type === 'success' && 'border-green-500 text-green-400',
                  log.type === 'info' && 'border-blue-500 text-blue-400'
                )}>
                  <div className="text-gray-500">[{log.time}]</div>
                  <div className="font-semibold">{log.message}</div>
                  {log.details && (
                    <pre className="text-gray-400 whitespace-pre-wrap break-all mt-1">{log.details}</pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
