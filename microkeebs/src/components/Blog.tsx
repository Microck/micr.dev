import { useTheme } from '../contexts/use-theme';

export function Blog() {
  const { isDark } = useTheme();

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

        <div className="text-center py-20">
          <h2
            className={`text-4xl sm:text-5xl font-bold mb-4 ${
              isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
            }`}
          >
            Coming Soon
          </h2>
          <p
            className={`text-lg ${
              isDark ? 'text-[#a7a495]/60' : 'text-[#1c1c1c]/60'
            }`}
          >
            Blog posts are on the way. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}
