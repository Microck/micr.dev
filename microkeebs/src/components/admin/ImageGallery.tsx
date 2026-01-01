import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  onReorder: (images: string[]) => void;
  onDelete: (index: number) => void;
  onRename: (index: number, newPath: string) => void;
}

export function ImageGallery({ images, onReorder, onDelete, onRename }: ImageGalleryProps) {
  const { isDark } = useTheme();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const newImages = [...images];
    const [removed] = newImages.splice(from, 1);
    newImages.splice(to, 0, removed);
    onReorder(newImages);
  };

  const getFileName = (path: string) => {
    return path.split('/').pop() || path;
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(getFileName(images[index]));
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    
    const oldPath = images[editingIndex];
    const pathParts = oldPath.split('/');
    pathParts[pathParts.length - 1] = editValue;
    const newPath = pathParts.join('/');
    
    if (newPath !== oldPath) {
      onRename(editingIndex, newPath);
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  if (images.length === 0) {
    return (
      <p className={cn(
        'text-center py-8 rounded-lg border-2 border-dashed',
        isDark ? 'text-gray-500 border-gray-700' : 'text-gray-400 border-gray-300'
      )}>
        No images yet
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className={cn(
              'relative group rounded-lg overflow-hidden shadow-sm',
              isDark ? 'bg-[#2a2a2a] ring-1 ring-gray-700' : 'bg-white ring-1 ring-gray-200'
            )}
          >
            <img
              src={image.replace('./', import.meta.env.BASE_URL)}
              alt={`Image ${index + 1}`}
              className="w-full aspect-video object-cover"
            />
            
            {/* Overlay with controls */}
            <div className={cn(
              'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity',
              'flex flex-col items-center justify-center gap-2',
              'bg-black/60'
            )}>
              <div className="flex items-center gap-1">
                {index > 0 && (
                  <button
                    onClick={() => moveImage(index, index - 1)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-md text-white transition-colors"
                    title="Move left"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => startEditing(index)}
                  className="p-2 bg-blue-500/80 hover:bg-blue-500 rounded-md text-white transition-colors"
                  title="Rename"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(index)}
                  className="p-2 bg-red-500/80 hover:bg-red-500 rounded-md text-white transition-colors"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                {index < images.length - 1 && (
                  <button
                    onClick={() => moveImage(index, index + 1)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-md text-white transition-colors"
                    title="Move right"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Index badge */}
            <div className={cn(
              'absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-md',
              index === 0 
                ? 'bg-blue-500 text-white' 
                : 'bg-black/60 text-white'
            )}>
              {index === 0 ? 'Cover' : `#${index + 1}`}
            </div>

            {/* Filename */}
            <div className={cn(
              'px-2 py-1.5 text-xs truncate',
              isDark ? 'text-gray-400' : 'text-gray-500'
            )}>
              {getFileName(image)}
            </div>
          </div>
        ))}
      </div>

      {/* Rename Modal */}
      {editingIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={cn(
            'p-6 rounded-xl shadow-xl max-w-md w-full mx-4',
            isDark ? 'bg-[#2a2a2a]' : 'bg-white'
          )}>
            <h3 className={cn(
              'text-lg font-semibold mb-4',
              isDark ? 'text-white' : 'text-gray-900'
            )}>
              Rename Image
            </h3>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              autoFocus
              className={cn(
                'w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500',
                isDark
                  ? 'bg-[#1c1c1c] border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              )}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={cancelEdit}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  isDark
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
