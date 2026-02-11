import { useTheme } from '../contexts/ThemeContext';
import { BlogMdxProvider } from './BlogMdxProvider';
import { formatDate } from '../utils/blog';
import type { BlogPost as BlogPostType } from '../types/BlogPost';

interface BlogPostProps {
  post: BlogPostType;
  onBack: () => void;
}

export function BlogPost({ post, onBack }: BlogPostProps) {
  const { isDark } = useTheme();
  const Content = post.content;

  return (
    <div className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen`}>
      <div className="mx-auto w-full max-w-[900px] px-6 py-16">
        <button
          onClick={onBack}
          className={`cursor-target button-morph mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors ${
            isDark
              ? 'text-[#a7a495]/70 hover:text-[#a7a495]'
              : 'text-[#1c1c1c]/70 hover:text-[#1c1c1c]'
          }`}
        >
          ← Back to blog
        </button>

        <article>
          <header className="mb-10">
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl font-bold leading-[0.95] tracking-tight ${
                isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
              }`}
            >
              {post.frontmatter.title}
            </h1>
            <div
              className={`mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm ${
                isDark ? 'text-[#a7a495]/70' : 'text-[#1c1c1c]/70'
              }`}
            >
              <time dateTime={post.frontmatter.date}>
                {formatDate(post.frontmatter.date)}
              </time>
              <span aria-hidden="true">|</span>
              <span>By {post.frontmatter.author}</span>
            </div>
            <p
              className={`mt-4 max-w-2xl text-lg leading-7 ${
                isDark ? 'text-[#a7a495]/80' : 'text-[#1c1c1c]/80'
              }`}
            >
              {post.frontmatter.description}
            </p>
          </header>

          <div
            className={`prose prose-lg max-w-none ${
              isDark
                ? 'prose-invert prose-headings:text-[#a7a495] prose-p:text-[#a7a495]/85 prose-strong:text-[#a7a495] prose-a:text-[#a7a495] prose-code:text-[#a7a495] prose-li:text-[#a7a495]/85'
                : 'prose-headings:text-[#1c1c1c] prose-p:text-[#1c1c1c]/85 prose-strong:text-[#1c1c1c] prose-a:text-[#1c1c1c] prose-code:text-[#1c1c1c] prose-li:text-[#1c1c1c]/85'
            }`}
          >
            <BlogMdxProvider>
              <Content />
            </BlogMdxProvider>
          </div>
        </article>
      </div>
    </div>
  );
}
