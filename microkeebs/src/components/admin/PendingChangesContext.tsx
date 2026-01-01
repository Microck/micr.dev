import { createContext, useContext, useState, ReactNode } from 'react';

export interface PendingImage {
  buildId: string;
  index: number;
  base64: string;
  localUrl: string; // for preview
}

export interface PendingBuild {
  id: string;
  title: string;
  youtubeTitle?: string;
  category: 'MX' | 'EC';
  timestamp: string;
  images: string[];
  youtubeUrl: string;
  specs: Record<string, string | undefined>;
  isNew?: boolean;
  isDeleted?: boolean;
}

interface PendingChangesContextType {
  pendingImages: PendingImage[];
  pendingBuilds: Map<string, PendingBuild>;
  pendingRankings: Record<string, string[]> | null;
  
  addPendingImage: (image: PendingImage) => void;
  removePendingImage: (buildId: string, index: number) => void;
  
  setPendingBuild: (build: PendingBuild) => void;
  deletePendingBuild: (id: string) => void;
  getPendingBuild: (id: string) => PendingBuild | undefined;
  
  setPendingRankings: (rankings: Record<string, string[]>) => void;
  
  hasChanges: boolean;
  clearAll: () => void;
  
  getImagePreviewUrl: (buildId: string, path: string) => string;
}

const PendingChangesContext = createContext<PendingChangesContextType | null>(null);

export function PendingChangesProvider({ children }: { children: ReactNode }) {
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [pendingBuilds, setPendingBuilds] = useState<Map<string, PendingBuild>>(new Map());
  const [pendingRankings, setPendingRankingsState] = useState<Record<string, string[]> | null>(null);

  const addPendingImage = (image: PendingImage) => {
    setPendingImages(prev => [...prev, image]);
  };

  const removePendingImage = (buildId: string, index: number) => {
    setPendingImages(prev => prev.filter(
      img => !(img.buildId === buildId && img.index === index)
    ));
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
    // Revoke object URLs to free memory
    pendingImages.forEach(img => URL.revokeObjectURL(img.localUrl));
    setPendingImages([]);
    setPendingBuilds(new Map());
    setPendingRankingsState(null);
  };

  const hasChanges = pendingImages.length > 0 || pendingBuilds.size > 0 || pendingRankings !== null;

  // Get preview URL for an image - returns local blob URL if pending, otherwise the real path
  const getImagePreviewUrl = (buildId: string, path: string) => {
    // Check if this is a pending image
    const pending = pendingImages.find(
      img => img.buildId === buildId && path.includes(`/${img.index}.webp`)
    );
    if (pending) {
      return pending.localUrl;
    }
    // Return the actual path (for already-deployed images)
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
      clearAll,
      getImagePreviewUrl,
    }}>
      {children}
    </PendingChangesContext.Provider>
  );
}

export function usePendingChanges() {
  const context = useContext(PendingChangesContext);
  if (!context) {
    throw new Error('usePendingChanges must be used within PendingChangesProvider');
  }
  return context;
}
