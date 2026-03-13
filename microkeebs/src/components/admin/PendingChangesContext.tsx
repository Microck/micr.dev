import { useState, useEffect } from 'react';
import { PendingChangesContext } from './pending-changes-context';
import type {
  PendingBuild,
  PendingChangesProviderProps,
  PendingImage,
} from './pending-changes-types';

const STORAGE_KEY = 'microkeebs_pending_changes';

// Save to localStorage (debounced)
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
const saveToStorage = (images: PendingImage[], builds: Map<string, PendingBuild>, rankings: Record<string, string[]> | null) => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      const data = {
        images: images.map(img => ({ ...img, localUrl: '' })), // Don't save blob URLs
        builds: Array.from(builds.entries()),
        rankings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save pending changes:', e);
    }
  }, 500);
};

export function PendingChangesProvider({ children }: PendingChangesProviderProps) {
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [pendingBuilds, setPendingBuilds] = useState<Map<string, PendingBuild>>(new Map());
  const [pendingRankings, setPendingRankingsState] = useState<Record<string, string[]> | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.images) {
          // Recreate blob URLs for images
          const restoredImages = data.images.map((img: PendingImage) => {
            if (img.base64) {
              const binary = atob(img.base64);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
              }
              const blob = new Blob([bytes], { type: 'image/jpeg' });
              return { ...img, localUrl: URL.createObjectURL(blob) };
            }
            return img;
          });
          setPendingImages(restoredImages);
        }
        if (data.builds) {
          setPendingBuilds(new Map(data.builds));
        }
        if (data.rankings) {
          setPendingRankingsState(data.rankings);
        }
      }
    } catch (e) {
      console.warn('Failed to load pending changes:', e);
    }
    setLoaded(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (loaded) {
      saveToStorage(pendingImages, pendingBuilds, pendingRankings);
    }
  }, [pendingImages, pendingBuilds, pendingRankings, loaded]);

  const addPendingImage = (image: PendingImage) => {
    setPendingImages(prev => [...prev, image]);
  };

  const removePendingImage = (buildId: string, index: number) => {
    setPendingImages(prev => {
      const toRemove = prev.find(img => img.buildId === buildId && img.index === index);
      if (toRemove?.localUrl) {
        URL.revokeObjectURL(toRemove.localUrl);
      }
      return prev.filter(img => !(img.buildId === buildId && img.index === index));
    });
  };

  const setPendingBuild = (build: PendingBuild) => {
    setPendingBuilds(prev => {
      const next = new Map(prev);
      next.set(build.id, build);
      return next;
    });
  };

  const deletePendingBuild = (id: string) => {
    setPendingBuilds(prev => {
      const next = new Map(prev);
      const existing = next.get(id);
      if (existing) {
        next.set(id, { ...existing, isDeleted: true });
      } else {
        next.set(id, { id, isDeleted: true } as PendingBuild);
      }
      return next;
    });
  };

  const getPendingBuild = (id: string) => {
    return pendingBuilds.get(id);
  };

  const setPendingRankings = (rankings: Record<string, string[]>) => {
    setPendingRankingsState(rankings);
  };

  const clearAll = () => {
    pendingImages.forEach(img => {
      if (img.localUrl) URL.revokeObjectURL(img.localUrl);
    });
    setPendingImages([]);
    setPendingBuilds(new Map());
    setPendingRankingsState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasChanges = pendingImages.length > 0 || pendingBuilds.size > 0 || pendingRankings !== null;
  const pendingCount = {
    images: pendingImages.length,
    builds: pendingBuilds.size,
  };

  const getImagePreviewUrl = (buildId: string, path: string) => {
    // Extract index from path like "./images/buildId/3.webp"
    const match = path.match(/\/(\d+)\.webp$/);
    if (match) {
      const index = parseInt(match[1], 10);
      const pending = pendingImages.find(img => img.buildId === buildId && img.index === index);
      if (pending?.localUrl) {
        return pending.localUrl;
      }
    }
    // Check for thumbnail
    if (path.includes('/thumbnail.')) {
      const pending = pendingImages.find(img => img.buildId === buildId && img.index === 0);
      if (pending?.localUrl) {
        return pending.localUrl;
      }
    }
    return path.replace('./', import.meta.env.BASE_URL);
  };

  return (
    <PendingChangesContext.Provider value={{
      pendingImages,
      pendingBuilds,
      pendingRankings,
      addPendingImage,
      removePendingImage,
      setPendingBuild,
      deletePendingBuild,
      getPendingBuild,
      setPendingRankings,
      hasChanges,
      pendingCount,
      clearAll,
      getImagePreviewUrl,
    }}>
      {children}
    </PendingChangesContext.Provider>
  );
}
