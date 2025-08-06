import { KeyboardBuild } from '../types/Build';

// Function to convert a title to a URL-friendly base slug
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '');    // Trim leading/trailing hyphens
}

// Interface for slug information
export interface SlugInfo {
  baseSlug: string;
  counter: number | null;
  fullPath: string;
}

// Function to generate slug information for a build
export function generateSlugInfo(build: KeyboardBuild, allBuilds: KeyboardBuild[]): SlugInfo {
  const baseSlug = slugify(build.title);
  
  // Find all builds with the same base title, sorted chronologically (oldest first)
  const sameTitleBuilds = allBuilds
    .filter(b => slugify(b.title) === baseSlug)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  const index = sameTitleBuilds.findIndex(b => b.id === build.id);
  const counter = index + 1;
  
  const hasDuplicates = sameTitleBuilds.length > 1;
  
  return {
    baseSlug,
    counter: hasDuplicates ? counter : null,
    fullPath: hasDuplicates 
      ? `/${baseSlug}/${counter}` 
      : `/${baseSlug}`
  };
}

// Function to find a build by slug and counter
export function findBuildBySlug(
  baseSlug: string, 
  counter: string | undefined, 
  allBuilds: KeyboardBuild[]
): KeyboardBuild | null {
  const sameTitleBuilds = allBuilds
    .filter(b => slugify(b.title) === baseSlug)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  if (sameTitleBuilds.length === 0) {
    return null;
  }
  
  if (!counter) {
    // If no counter provided, return the first (oldest) build
    return sameTitleBuilds[0];
  }
  
  const counterNum = parseInt(counter, 10);
  if (isNaN(counterNum) || counterNum < 1 || counterNum > sameTitleBuilds.length) {
    return null;
  }
  
  return sameTitleBuilds[counterNum - 1];
}

// Function to get all slug paths for static generation (if needed)
export function getAllSlugPaths(allBuilds: KeyboardBuild[]): string[] {
  const paths: string[] = [];
  
  allBuilds.forEach(build => {
    const slugInfo = generateSlugInfo(build, allBuilds);
    paths.push(slugInfo.fullPath);
  });
  
  return paths;
}