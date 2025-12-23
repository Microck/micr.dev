import { useRef, useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '@/lib/utils';

export function InteractiveDivider() {
  const { isDark } = useTheme();
  const path = useRef<SVGPathElement>(null);
  const [width, setWidth] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  
  const progress = useRef(0);
  const x = useRef(0.5);
  const reqId = useRef<number | null>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    if (container.current) {
      resizeObserver.observe(container.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const setPath = (p: number) => {
    const w = width;
    const h = 50; 
    const y = h / 2;
    
    if (path.current) {
      path.current.setAttributeNS(
        null,
        "d",
        `M0,${y} Q${w * x.current},${y + p} ${w},${y}`
      );
    }
  };

  const manageMouseMove = (e: React.MouseEvent) => {
    const { movementY, clientX } = e;
    const rect = container.current?.getBoundingClientRect();
    if (rect) {
      x.current = (clientX - rect.left) / rect.width;
      
      progress.current += movementY;
      
      const maxStretch = 100;
      if (progress.current > maxStretch) progress.current = maxStretch;
      if (progress.current < -maxStretch) progress.current = -maxStretch;

      setPath(progress.current);
    }
  };

  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

  const animateElastic = () => {
    progress.current = lerp(progress.current, 0, 0.1);

    if(Math.abs(progress.current) < 0.1){
       progress.current = 0;
       setPath(0);
    }
    else{
       setPath(progress.current);
       reqId.current = requestAnimationFrame(animateElastic);
    }
  }

  const manageMouseLeave = () => {
    if(reqId.current) cancelAnimationFrame(reqId.current);
    animateElastic();
  };

  const manageMouseEnter = () => {
    if(reqId.current) {
      cancelAnimationFrame(reqId.current);
      reqId.current = null;
    }
  };

  return (
    <div 
      ref={container}
      className="relative w-full h-[50px] flex items-center justify-center my-16 z-20" 
      onMouseMove={manageMouseMove}
      onMouseLeave={manageMouseLeave}
      onMouseEnter={manageMouseEnter}
    >
      <div className={cn(
        "absolute w-full h-[1px]", 
        isDark ? "bg-[#a7a495]/20" : "bg-[#1c1c1c]/20"
      )} />
      
      <svg className="w-full h-full absolute top-0 left-0 overflow-visible">
        <path
          ref={path}
          d={`M0,25 Q${width/2},25 ${width},25`}
          fill="none"
          stroke={isDark ? "#a7a495" : "#1c1c1c"}
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
