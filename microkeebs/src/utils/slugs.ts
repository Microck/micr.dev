import { KeyboardBuild } from '../types/Build';

// Define a new type that includes the slug
export type BuildWithSlug = KeyboardBuild & { slug: string };

// Function to convert a title to a URL-friendly slug
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '');    // Trim leading/trailing hyphens
}

// Function to process all builds, sort them, and assign unique slugs
export function getBuildsWithSlugs(builds: KeyboardBuild[]): BuildWithSlug[] {
  const slugCounts: Record<string, number> = {};

  // Sort builds by timestamp, oldest first
  const sortedBuilds = [...builds].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return sortedBuilds.map((build) => {
    const baseSlug = slugify(build.title);
    
    // Increment the count for this base slug
    slugCounts[baseSlug] = (slugCounts[baseSlug] || 0) + 1;
    const count = slugCounts[baseSlug];

    // Append the count to the slug
    const finalSlug = `${baseSlug}-${count}`;

    return { ...build, slug: finalSlug };
  });
}