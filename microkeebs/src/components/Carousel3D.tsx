import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface Carousel3DProps {
  images: string[];
}

export function Carousel3D({ images }: Carousel3DProps) {
  const ringRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentRotation = useRef(0);
  const targetRotation = useRef(0);

  useEffect(() => {
    if (!ringRef.current) return;
    
    // Initial animation
    gsap.fromTo(ringRef.current, 
      { rotationY: 180, scale: 0.8, opacity: 0 },
      { rotationY: 0, scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" }
    );
    
    // Ticker for smooth inertia
    const update = () => {
      if (!isDragging) {
        currentRotation.current += (targetRotation.current - currentRotation.current) * 0.1;
      }
      if (ringRef.current) {
        gsap.set(ringRef.current, { rotationY: currentRotation.current });
      }
    };
    
    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, [isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX.current;
    // Sensitivity factor
    targetRotation.current += delta * 0.5;
    currentRotation.current = targetRotation.current;
    startX.current = e.clientX;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const radius = 500;
  const angleStep = 360 / images.length;

  return (
    <div 
      className="w-full h-[60vh] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ perspective: '1000px' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div 
        ref={ringRef}
        className="relative w-0 h-0"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '400px',
              height: '300px',
              transform: `rotateY(${i * angleStep}deg) translateZ(${radius}px)`,
              backfaceVisibility: 'hidden'
            }}
          >
            <img 
              src={src} 
              alt={`View ${i + 1}`} 
              className="w-full h-full object-cover rounded-xl shadow-2xl border-4 border-white/10"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
