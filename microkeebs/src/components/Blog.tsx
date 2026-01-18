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
        
        <div className={`mt-16 text-sm font-medium tracking-wide ${
          isDark ? 'text-[#a7a495]/30' : 'text-[#1c1c1c]/30'
        }`}>
          <ul className="flex flex-col gap-2">
            <li>TGR Jane V2 CE</li>
            <li>Toro60</li>
            <li>Diversity TKL</li>
            <li>HHKB Pro 2</li>
            <li>Geonworks F1-8X V2</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
