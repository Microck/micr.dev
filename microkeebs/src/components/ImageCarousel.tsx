import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ImageCarouselProps {
  images: string[];
}

interface CarouselSettings {
  radius: number;
  perspective: number;
  sensitivity: number;
  imageWidth: number;
  imageHeight: number;
}

const DEFAULT_SETTINGS: CarouselSettings = {
  radius: 600,
  perspective: 1200,
  sensitivity: 0.3,
  imageWidth: 400,
  imageHeight: 267,
};

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showDebug, setShowDebug] = useState(false);
  const [settings, setSettings] = useState<CarouselSettings>(DEFAULT_SETTINGS);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastX = useRef(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientX - lastX.current;
    setRotation(prev => prev + delta * settings.sensitivity);
    lastX.current = e.clientX;
  }, [settings.sensitivity]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  const updateSetting = (key: keyof CarouselSettings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

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
              className="flex-shrink-0 w-[280px] rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={src}
                alt={`Image ${i + 1}`}
                className="w-full h-auto object-contain pointer-events-none"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  const angleStep = 360 / images.length;

  return (
    <div className="w-full relative">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="absolute top-2 right-2 z-50 px-3 py-1 bg-black/50 text-white text-xs rounded hover:bg-black/70"
      >
        {showDebug ? 'Hide Debug' : 'Debug'}
      </button>

      {showDebug && (
        <div className="absolute top-10 right-2 z-50 p-4 bg-black/80 text-white text-xs rounded-lg w-64 space-y-3">
          <div>
            <label className="block mb-1">Radius: {settings.radius}px</label>
            <input
              type="range"
              min="200"
              max="1500"
              value={settings.radius}
              onChange={(e) => updateSetting('radius', Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Perspective: {settings.perspective}px</label>
            <input
              type="range"
              min="400"
              max="3000"
              value={settings.perspective}
              onChange={(e) => updateSetting('perspective', Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Sensitivity: {settings.sensitivity.toFixed(2)}</label>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={settings.sensitivity}
              onChange={(e) => updateSetting('sensitivity', Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Image Width: {settings.imageWidth}px</label>
            <input
              type="range"
              min="150"
              max="800"
              value={settings.imageWidth}
              onChange={(e) => updateSetting('imageWidth', Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Image Height: {settings.imageHeight}px</label>
            <input
              type="range"
              min="100"
              max="600"
              value={settings.imageHeight}
              onChange={(e) => updateSetting('imageHeight', Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="pt-2 border-t border-white/20">
            <p>Images: {images.length}</p>
            <p>Angle step: {angleStep.toFixed(1)}°</p>
            <p>Rotation: {rotation.toFixed(1)}°</p>
          </div>
          <button
            onClick={() => setSettings(DEFAULT_SETTINGS)}
            className="w-full py-1 bg-white/20 rounded hover:bg-white/30"
          >
            Reset to Default
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: `${settings.perspective}px` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          className="relative"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`,
            width: `${settings.imageWidth}px`,
            height: `${settings.imageHeight}px`,
          }}
        >
          {images.map((src, i) => {
            const angle = i * angleStep;
            return (
              <div
                key={i}
                className="absolute top-0 left-0 rounded-lg overflow-hidden shadow-2xl"
                style={{
                  width: `${settings.imageWidth}px`,
                  height: `${settings.imageHeight}px`,
                  transform: `rotateY(${angle}deg) translateZ(${settings.radius}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <img
                  src={src}
                  alt={`Image ${i + 1}`}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
