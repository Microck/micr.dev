import { KeyboardBuild } from '../types/Build';

// The type definition remains the same
export type BuildWithSlug = KeyboardBuild & { slug: string };

// Function to convert a title to a URL-friendly slug
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '');    // Trim leading/trailing hyphens
}

// New function to handle conditional suffixes
export function getBuildsWithSlugs(builds: KeyboardBuild[]): BuildWithSlug[] {
  const baseSlugCounts: Record<string, number> = {};

  // First pass: Count the total occurrences of each base slug
  for (const build of builds) {
    const baseSlug = slugify(build.title);
    baseSlugCounts[baseSlug] = (baseSlugCounts[baseSlug] || 0) + 1;
  }

  // Sort builds by timestamp, oldest first, to ensure suffixes are chronological
  const sortedBuilds = [...builds].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const runningSlugCounts: Record<string, number> = {};

  // Second pass: Generate the final slugs
  return sortedBuilds.map((build) => {
    const baseSlug = slugify(build.title);
    const totalCount = baseSlugCounts[baseSlug];

    let finalSlug: string;

    if (totalCount === 1) {
      // If there's only one, use the base slug without a number
      finalSlug = baseSlug;
    } else {
      // If there are duplicates, increment the running count and add the suffix
      runningSlugCounts[baseSlug] = (runningSlugCounts[baseSlug] || 0) + 1;
      const currentIndex = runningSlugCounts[baseSlug];
      finalSlug = `${baseSlug}-${currentIndex}`;
    }

    return { ...build, slug: finalSlug };
  });
}