import { useTheme } from '../contexts/use-theme';
import { cn } from '@/lib/utils';

export function InteractiveDivider() {
  const { isDark } = useTheme();
  
  return (
    <div 
      className="relative w-full h-[50px] flex items-center justify-center my-4 z-20 pointer-events-none" 
    >
      <div className={cn(
        "absolute w-full h-[1px]", 
        isDark ? "bg-[#a7a495]/20" : "bg-[#1c1c1c]/20"
      )} />
      
      <svg className="w-full h-full absolute top-0 left-0" style={{ overflow: 'visible' }}>
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke={isDark ? "#a7a495" : "#1c1c1c"}
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
