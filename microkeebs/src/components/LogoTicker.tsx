import { useTheme } from '../contexts/use-theme';

interface LogoTickerProps {
  items: string[];
  title?: string;
}

export function LogoTicker({ items, title = "Worked with" }: LogoTickerProps) {
  const { isDark } = useTheme();
  
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="w-full py-12">
      {title && (
        <h3 className={`text-center text-sm uppercase tracking-[0.3em] mb-8 ${
          isDark ? 'text-[#a7a495]/70' : 'text-[#1c1c1c]/70'
        }`}>
          {title}
        </h3>
      )}
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll">
          {duplicatedItems.map((item, index) => (
            <div
              key={index}
              className={`flex-shrink-0 mx-8 px-6 py-3 rounded-full border ${
                isDark 
                  ? 'border-[#a7a495]/20 text-[#a7a495]' 
                  : 'border-[#1c1c1c]/20 text-[#1c1c1c]'
              }`}
            >
              <span className="text-base font-medium whitespace-nowrap">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
