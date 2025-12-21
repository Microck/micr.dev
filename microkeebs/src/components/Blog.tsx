import { useTheme } from '../contexts/ThemeContext';

export function Blog() {
  const { isDark } = useTheme();

  return (
    <div className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} min-h-screen flex items-center justify-center`}>
      <div className="text-center px-8">
        <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${
          isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
        }`}>
          Nothing here yet
        </h1>
        <p className={`text-xl sm:text-2xl ${
          isDark ? 'text-[#a7a495]/60' : 'text-[#1c1c1c]/60'
        }`}>
          Keep an eye out
        </p>
      </div>
    </div>
  );
}
