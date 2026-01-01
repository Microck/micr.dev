import { useState } from 'react';
import { cn } from '@/lib/utils';
import { usePendingChanges } from './PendingChangesContext';

interface ImageGalleryProps {
  buildId: string;
  images: string[];
  onReorder: (images: string[]) => void;
  onDelete: (index: number) => void;
  onRename: (index: number, newPath: string) => void;
}

// Image card with loading state
function ImageCard({ 
  src, 
  index, 
  onMoveLeft,
  onMoveRight,
  onEdit,
  onDelete,
  fileName,
}: { 
  src: string; 
  index: number;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  fileName: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative group rounded-lg overflow-hidden shadow-sm bg-[#eae7dd] ring-1 ring-[#d9d5c9]">
      {/* Image container */}
      <div className="relative aspect-video bg-[#d9d5c9]">
        {!loaded && !error && (
          <div className="absolute inset-0 animate-pulse bg-[#d9d5c9]" />
        )}
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#e0dcd0]">
            <svg className="w-8 h-8 text-[#a65d5d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        ) : (
          <img
            src={src}
            alt={`Image ${index + 1}`}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-200',
              loaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}
        
        {/* Overlay with controls */}
        <div className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity',
          'flex flex-col items-center justify-center gap-2',
          'bg-black/60'
        )}>
          <div className="flex items-center gap-1">
            {onMoveLeft && (
              <button
                onClick={onMoveLeft}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-md text-white transition-colors"
                title="Move left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <button
              onClick={onEdit}
              className="p-2 bg-[#5c5647]/80 hover:bg-[#5c5647] rounded-md text-white transition-colors"
              title="Rename"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-[#a65d5d]/80 hover:bg-[#a65d5d] rounded-md text-white transition-colors"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            {onMoveRight && (
              <button
                onClick={onMoveRight}
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
            ? 'bg-[#5c5647] text-white' 
            : 'bg-black/60 text-white'
        )}>
          {index === 0 ? 'Cover' : `#${index + 1}`}
        </div>
      </div>

      {/* Filename */}
      <div className="px-2 py-1.5 text-xs truncate text-[#6b6459]">
        {fileName}
      </div>
    </div>
  );
}

export function ImageGallery({ buildId, images, onReorder, onDelete, onRename }: ImageGalleryProps) {
  const { getImagePreviewUrl } = usePendingChanges();
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
      <p className="text-center py-8 rounded-lg border-2 border-dashed text-[#8b8578] border-[#d9d5c9]">
        No images yet
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <ImageCard
            key={`${image}-${index}`}
            src={getImagePreviewUrl(buildId, image)}
            index={index}
            fileName={getFileName(image)}
            onMoveLeft={index > 0 ? () => moveImage(index, index - 1) : undefined}
            onMoveRight={index < images.length - 1 ? () => moveImage(index, index + 1) : undefined}
            onEdit={() => startEditing(index)}
            onDelete={() => onDelete(index)}
          />
        ))}
      </div>

      {/* Rename Modal */}
      {editingIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-6 rounded-xl shadow-xl max-w-md w-full mx-4 bg-[#f5f3ed]">
            <h3 className="text-lg font-semibold mb-4 text-[#3d3a32]">
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
              className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-0 bg-white border-[#d9d5c9] text-[#3d3a32] focus:border-[#5c5647]"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 rounded-lg font-medium transition-colors text-[#6b6459] hover:bg-[#e0dcd0]"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 rounded-lg font-medium bg-[#5c5647] hover:bg-[#4a463a] text-white transition-colors"
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
