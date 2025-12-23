import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  onReorder: (images: string[]) => void;
  onDelete: (index: number) => void;
}

export function ImageGallery({ images, onReorder, onDelete }: ImageGalleryProps) {
  const { isDark } = useTheme();

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const newImages = [...images];
    const [removed] = newImages.splice(from, 1);
    newImages.splice(to, 0, removed);
    onReorder(newImages);
  };

  if (images.length === 0) {
    return (
      <p className={cn(
        'text-center py-4',
        isDark ? 'text-gray-500' : 'text-gray-400'
      )}>
        No images yet
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {images.map((image, index) => (
        <div
          key={`${image}-${index}`}
          className={cn(
            'relative group rounded overflow-hidden',
            isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'
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
            'flex items-center justify-center gap-1',
            'bg-black/50'
          )}>
            {index > 0 && (
              <button
                onClick={() => moveImage(index, index - 1)}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded text-white text-sm"
                title="Move left"
              >
                ←
              </button>
            )}
            <button
              onClick={() => onDelete(index)}
              className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded text-white text-sm"
              title="Delete"
            >
              ×
            </button>
            {index < images.length - 1 && (
              <button
                onClick={() => moveImage(index, index + 1)}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded text-white text-sm"
                title="Move right"
              >
                →
              </button>
            )}
          </div>

          {/* Index badge */}
          <div className={cn(
            'absolute top-1 left-1 px-1.5 py-0.5 text-xs rounded',
            'bg-black/60 text-white'
          )}>
            {index === 0 ? 'Thumbnail' : index}
          </div>
        </div>
      ))}
    </div>
  );
}
