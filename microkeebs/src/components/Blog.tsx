import { useTheme } from '../contexts/ThemeContext';
import { getAllPosts, formatDate } from '../utils/blog';
import type { BlogPost } from '../types/BlogPost';

interface BlogListingProps {
  onPostClick: (post: BlogPost) => void;
}

export function Blog({ onPostClick }: BlogListingProps) {
  const { isDark } = useTheme();
  const posts = getAllPosts();

  return (
    <div className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen`}>
      <div className="mx-auto w-full max-w-[900px] px-6 py-16">
        <header className="mb-12">
          <h1
            className={`text-5xl sm:text-6xl md:text-7xl font-bold leading-[0.9] tracking-tight ${
              isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
            }`}
          >
            Blog
          </h1>
          <p
            className={`mt-4 max-w-2xl text-lg leading-7 ${
              isDark ? 'text-[#a7a495]/80' : 'text-[#1c1c1c]/80'
            }`}
          >
            Product updates, releases, and writing.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p
              className={`text-xl ${
                isDark ? 'text-[#a7a495]/60' : 'text-[#1c1c1c]/60'
              }`}
            >
              No posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                onClick={() => onPostClick(post)}
                className={`cursor-target card-hover rounded-3xl p-6 sm:p-8 ${
                  isDark ? 'bg-[#2a2a2a]' : 'bg-[#b5b3a7]'
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div
                    className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm ${
                      isDark ? 'text-[#a7a495]/70' : 'text-[#1c1c1c]/70'
                    }`}
                  >
                    <time dateTime={post.frontmatter.date}>
                      {formatDate(post.frontmatter.date)}
                    </time>
                    <span aria-hidden="true">|</span>
                    <span>By {post.frontmatter.author}</span>
                  </div>
                  <h2
                    className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                      isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
                    }`}
                  >
                    {post.frontmatter.title}
                  </h2>
                  <p
                    className={`text-base leading-7 ${
                      isDark ? 'text-[#a7a495]/80' : 'text-[#1c1c1c]/80'
                    }`}
                  >
                    {post.frontmatter.description}
                  </p>
                  <div className="pt-2">
                    <span
                      className={`inline-flex items-center text-sm font-medium ${
                        isDark
                          ? 'text-[#a7a495] hover:text-[#c7c4b3]'
                          : 'text-[#1c1c1c] hover:text-[#2a2a2a]'
                      }`}
                    >
                      Read more →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
