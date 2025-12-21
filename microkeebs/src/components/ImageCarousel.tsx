import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Draggable } from 'gsap/all';

gsap.registerPlugin(Draggable);

interface ImageCarouselProps {
  images: string[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const ringRef = useRef<HTMLDivElement>(null);
  const draggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const xPosRef = useRef(0);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile || !ringRef.current || !draggerRef.current || images.length === 0) return;

    const ring = ringRef.current;
    const dragger = draggerRef.current;
    const angleStep = 360 / images.length;
    const radius = 400;

    imagesRef.current.forEach((img, i) => {
      if (!img) return;
      gsap.set(img, {
        rotateY: i * angleStep,
        z: radius,
        backgroundImage: `url(${images[i]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backfaceVisibility: 'hidden',
      });
    });

    gsap.set(ring, { rotationY: 0, z: -radius });

    gsap.from(imagesRef.current.filter(Boolean), {
      duration: 1.5,
      y: 200,
      opacity: 0,
      stagger: 0.1,
      ease: 'expo.out',
    });

    const draggableInstance = Draggable.create(dragger, {
      type: 'x',
      inertia: true,
      onDragStart: function (e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        xPosRef.current = Math.round(clientX);
      },
      onDrag: function (e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const delta = (Math.round(clientX) - xPosRef.current);
        
        gsap.to(ring, {
          rotationY: `+=${delta * 0.5}`,
          duration: 0.3,
          overwrite: true,
          ease: 'power1.out',
        });
        xPosRef.current = Math.round(clientX);
      },
      onDragEnd: function () {
        gsap.set(dragger, { x: 0, y: 0 });
      },
    });

    return () => {
      draggableInstance[0]?.kill();
    };
  }, [isMobile, images]);

  if (isMobile) {
    return (
      <div className="w-full overflow-hidden">
        <motion.div
          className="flex gap-4 cursor-grab active:cursor-grabbing px-4"
          drag="x"
          dragConstraints={{ left: -((images.length * 296) - window.innerWidth + 32), right: 0 }}
          dragElastic={0.2}
          whileTap={{ cursor: "grabbing" }}
        >
          {images.map((src, i) => (
            <motion.div
              key={i}
              className="flex-shrink-0 w-[280px] aspect-video rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={src}
                alt={`Image ${i + 1}`}
                className="w-full h-full object-cover pointer-events-none"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-[60vh] relative overflow-hidden flex items-center justify-center">
      <div
        ref={containerRef}
        className="relative w-[500px] h-[360px]"
        style={{ perspective: '2000px' }}
      >
        <div
          ref={ringRef}
          className="w-full h-full absolute transform-style-3d"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {images.map((_, i) => (
            <div
              key={i}
              ref={(el) => { imagesRef.current[i] = el; }}
              className="absolute w-full h-full rounded-xl shadow-2xl border-4 border-white/10"
              style={{ backfaceVisibility: 'hidden' }}
            />
          ))}
        </div>
      </div>
      <div
        ref={draggerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-50"
      />
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 100%)',
        }}
      />
    </div>
  );
}
