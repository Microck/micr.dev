import type { BlogPost, BlogPostModule } from '../types/BlogPost';

// Import all blog posts using Vite's glob import
const blogModules = import.meta.glob('/src/content/blog/*.mdx', { eager: true }) as Record<
  string,
  BlogPostModule
>;

export function getAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const [path, module] of Object.entries(blogModules)) {
    // Extract slug from filename (e.g., /src/content/blog/hello-world.mdx -> hello-world)
    const slug = path.replace('/src/content/blog/', '').replace('.mdx', '');

    if (!module.frontmatter) {
      continue;
    }

    if (module.frontmatter.published !== false) {
      posts.push({
        slug,
        frontmatter: module.frontmatter,
        content: module.default,
      });
    }
  }

  // Sort by date descending (newest first)
  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const path = `/src/content/blog/${slug}.mdx`;
  const module = blogModules[path];

  if (!module) {
    return null;
  }

  return {
    slug,
    frontmatter: module.frontmatter,
    content: module.default,
  };
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
