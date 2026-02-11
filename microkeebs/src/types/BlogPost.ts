export interface BlogPostFrontmatter {
  title: string;
  date: string;
  description: string;
  author: string;
  published: boolean;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogPostFrontmatter;
  content: React.ComponentType;
}

export interface BlogPostModule {
  default: React.ComponentType;
  frontmatter: BlogPostFrontmatter;
}
