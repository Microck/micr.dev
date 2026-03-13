import type { ReactNode } from 'react';

export interface PendingImage {
  buildId: string;
  index: number;
  base64: string;
  localUrl: string;
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

export interface PendingChangesContextType {
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
  pendingCount: { images: number; builds: number };
  clearAll: () => void;

  getImagePreviewUrl: (buildId: string, path: string) => string;
}

export interface PendingChangesProviderProps {
  children: ReactNode;
}
