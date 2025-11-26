import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { MagnifyImage } from './MagnifyImage';

interface ImageCarouselProps {
  images: string[];
  title: string;
}

export function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedMap, setLoadedMap] = useState<Record<number, boolean>>({});
  const { isDark } = useTheme();

  const markLoaded = (index: number) => {
    setLoadedMap((prev) => {
      if (prev[index]) return prev;
      return { ...prev, [index]: true };
    });
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const renderMainImage = (imageSrc: string, index: number) => (
    <>
      <div className={`carousel-skeleton ${loadedMap[index] ? 'carousel-skeleton--hidden' : ''}`}>
        <div className="carousel-skeleton__shine" />
      </div>
      <MagnifyImage
        key={imageSrc}
        src={imageSrc}
        alt={`${title} - Image ${index + 1}`}
        className={`carousel-main-image ${loadedMap[index] ? 'is-loaded' : ''}`}
      />
      <img
        src={imageSrc}
        alt={`${title} - Image ${index + 1}`}
        style={{ display: 'none' }}
        loading="lazy"
        decoding="async"
        onLoad={() => markLoaded(index)}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const placeholder = target.nextElementSibling as HTMLElement;
          if (placeholder) placeholder.style.display = 'flex';
        }}
      />
    </>
  );

  const renderThumbnail = (imageSrc: string, index: number) => (
    <>
      <div className={`carousel-skeleton ${loadedMap[index] ? 'carousel-skeleton--hidden' : ''}`}>
        <div className="carousel-skeleton__shine" />
      </div>
      <img
        key={imageSrc}
        src={imageSrc}
        alt={`${title} - Image ${index + 1}`}
        className={`carousel-thumb__image ${loadedMap[index] ? 'is-loaded' : ''}`}
        loading="lazy"
        decoding="async"
        onLoad={() => markLoaded(index)}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const placeholder = target.nextElementSibling as HTMLElement;
          if (placeholder) placeholder.style.display = 'flex';
        }}
      />
    </>
  );

  if (images.length === 1) {
    return (
      <div className="space-y-4">
        <div className="carousel-frame">
          <div className="carousel-zoom">
            {renderMainImage(images[0], 0)}
            <div className="placeholder-bg carousel-placeholder">
              <span className={`text-2xl font-normal ${isDark ? 'text-[#1c1c1c]' : 'text-[#1c1c1c]'}`}>
                THUMBNAIL
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative carousel-frame">
        <div className="carousel-zoom">
          {renderMainImage(images[currentIndex], currentIndex)}
          <div className="placeholder-bg carousel-placeholder absolute inset-0">
            <span className={`text-2xl font-normal ${isDark ? 'text-[#1c1c1c]' : 'text-[#1c1c1c]'}`}>
              {currentIndex === 0 ? 'THUMBNAIL' : `IMAGE ${currentIndex + 1}`}
            </span>
          </div>
        </div>
        <button
          onClick={goToPrevious}
          className={`carousel-nav carousel-nav--left ${isDark ? 'text-[#a7a495]' : 'text-white'}`}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goToNext}
          className={`carousel-nav carousel-nav--right ${isDark ? 'text-[#a7a495]' : 'text-white'}`}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div
        className="flex justify-center space-x-2 overflow-x-auto carousel-thumbnails"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((image, index) => (
          <button
            key={image}
            onClick={() => setCurrentIndex(index)}
            className={`carousel-thumb ${
              index === currentIndex
                ? isDark
                  ? 'ring-2 ring-[#a7a495]'
                  : 'ring-2 ring-[#1c1c1c]'
                : isDark
                  ? 'hover:ring-1 hover:ring-[#a7a495]/50'
                  : 'hover:ring-1 hover:ring-[#1c1c1c]/50'
            }`}
          >
            <div className="carousel-thumb__inner">
              {renderThumbnail(image, index)}
              <div className="placeholder-bg carousel-placeholder">
                <span className={`text-xs ${isDark ? 'text-[#1c1c1c]' : 'text-[#1c1c1c]'}`}>
                  {index === 0 ? 'THUMB' : index + 1}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <span className={`text-sm ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>
          {currentIndex + 1} of {images.length}
        </span>
      </div>
    </div>
  );
}
