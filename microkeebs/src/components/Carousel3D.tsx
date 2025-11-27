import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useTheme } from '../contexts/ThemeContext';

interface Carousel3DProps {
  images: string[];
  title: string;
}

export function Carousel3D({ images, title }: Carousel3DProps) {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [currentRotation, setCurrentRotation] = useState(180);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const itemCount = images.length;
  const angleIncrement = 360 / itemCount;

  useEffect(() => {
    if (!ringRef.current) return;

    // Set initial rotation
    gsap.set(ringRef.current, { rotationY: 180 });

    // Intro animation
    const items = ringRef.current.querySelectorAll('.carousel3d-item');
    gsap.fromTo(
      items,
      { y: 200, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.1,
      }
    );
  }, []);

  useEffect(() => {
    if (!ringRef.current) return;
    gsap.to(ringRef.current, {
      rotationY: currentRotation,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, [currentRotation]);

  const getBgPos = (index: number) => {
    const wrappedRotation = ((currentRotation - 180 - index * angleIncrement) % 360 + 360) % 360;
    const offset = 100 - (wrappedRotation / 360) * 500;
    return `${offset}px 0px`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const delta = currentX - dragStartX.current;
    setCurrentRotation((prev) => (prev - delta) % 360);
    dragStartX.current = currentX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const delta = currentX - dragStartX.current;
    setCurrentRotation((prev) => (prev - delta) % 360);
    dragStartX.current = currentX;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleImageMouseEnter = (index: number) => {
    setHoveredIndex(index);
    const items = ringRef.current?.querySelectorAll('.carousel3d-item');
    if (!items) return;

    items.forEach((item, i) => {
      gsap.to(item, {
        opacity: i === index ? 1 : 0.5,
        duration: 0.3,
        ease: 'power3.out',
      });
    });
  };

  const handleImageMouseLeave = () => {
    setHoveredIndex(null);
    const items = ringRef.current?.querySelectorAll('.carousel3d-item');
    if (!items) return;

    items.forEach((item) => {
      gsap.to(item, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    });
  };

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative mx-auto"
        style={{
          width: '300px',
          height: '400px',
          perspective: '2000px',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={ringRef}
          className="carousel3d-ring"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            overflow: 'hidden',
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="carousel3d-item"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                transformOrigin: '50% 50% -500px',
                transform: `rotateY(${-index * angleIncrement}deg) translateZ(-500px)`,
                backfaceVisibility: 'hidden',
                userSelect: 'none',
              }}
              onMouseEnter={() => handleImageMouseEnter(index)}
              onMouseLeave={handleImageMouseLeave}
            >
              <div
                className="w-full h-full bg-cover bg-center cursor-target"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundPosition: getBgPos(index),
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .carousel3d-ring {
          background: ${isDark ? '#000' : '#f5f5f5'};
        }
      `}</style>
    </div>
  );
}
