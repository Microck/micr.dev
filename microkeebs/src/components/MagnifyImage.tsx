import React, { useState, useRef } from 'react';

interface MagnifyImageProps {
  src: string;
  alt: string;
  className?: string;
  magnification?: number;
}

export function MagnifyImage({ src, alt, className = '', magnification = 2.5 }: MagnifyImageProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const elem = imgRef.current;
    if (!elem) return;

    const { top, left, width, height } = elem.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    if (x >= 0 && y >= 0 && x <= width && y <= height) {
      setShowMagnifier(true);
      setMagnifierPosition({ x, y });
    } else {
      setShowMagnifier(false);
    }
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div className="relative inline-block">
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`${className} cursor-crosshair`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {showMagnifier && (
        <div
          className="absolute pointer-events-none border-2 border-white/80 rounded-full shadow-2xl overflow-hidden"
          style={{
            width: '150px',
            height: '150px',
            top: `${magnifierPosition.y - 75}px`,
            left: `${magnifierPosition.x - 75}px`,
            backgroundImage: `url(${src})`,
            backgroundSize: `${imgRef.current?.width! * magnification}px ${imgRef.current?.height! * magnification}px`,
            backgroundPosition: `-${magnifierPosition.x * magnification - 75}px -${magnifierPosition.y * magnification - 75}px`,
            backgroundRepeat: 'no-repeat',
            zIndex: 100
          }}
        />
      )}
    </div>
  );
}
