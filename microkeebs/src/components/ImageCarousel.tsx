import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ImageCarouselProps {
  images: string[];
  title: string;
}

export function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isDark } = useTheme();

  // If only one image (thumbnail only), show simple static display
  if (images.length === 1) {
    return (
      <div className="space-y-4">
        <div className="w-full h-96 overflow-hidden rounded-lg">
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover carousel-slide"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const placeholder = target.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
          {/* Fallback placeholder */}
          <div className="placeholder-bg w-full h-full hidden items-center justify-center">
            <span className={`text-2xl font-normal ${isDark ? 'text-[#1c1c1c]' : 'text-[#1c1c1c]'}`}>
              THUMBNAIL
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Multiple images - show carousel with navigation
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

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative">
        <div className="w-full h-96 overflow-hidden rounded-lg">
          <img
            src={images[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover carousel-slide"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const placeholder = target.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
          {/* Fallback placeholder */}
          <div className="placeholder-bg w-full h-full hidden items-center justify-center absolute top-0 left-0">
            <span className={`text-2xl font-normal ${isDark ? 'text-[#1c1c1c]' : 'text-[#1c1c1c]'}`}>
              {currentIndex === 0 ? 'THUMBNAIL' : `IMAGE ${currentIndex + 1}`}
            </span>
          </div>
          
          <button
            onClick={goToPrevious}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition-all duration-300 smooth-bounce bg-black bg-opacity-50 rounded-full p-2 ${
              isDark ? 'text-[#a7a495]' : 'text-white'
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={goToNext}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition-all duration-300 smooth-bounce bg-black bg-opacity-50 rounded-full p-2 ${
              isDark ? 'text-[#a7a495]' : 'text-white'
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      
      {/* Thumbnails - Show up to 5 images */}
      <div className="flex justify-center space-x-2 overflow-x-auto">
        {images.slice(0, 5).map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-20 h-16 overflow-hidden rounded thumbnail-hover flex-shrink-0 ${
              index === currentIndex
                ? isDark 
                  ? 'ring-2 ring-[#a7a495]' 
                  : 'ring-2 ring-[#1c1c1c]'
                : isDark 
                  ? 'hover:ring-1 hover:ring-[#a7a495] hover:ring-opacity-50' 
                  : 'hover:ring-1 hover:ring-[#1c1c1c] hover:ring-opacity-50'
            }`}
          >
            <img
              src={image}
              alt={`${title} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if thumbnail fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const placeholder = target.nextElementSibling as HTMLElement;
                if (placeholder) placeholder.style.display = 'flex';
              }}
            />
            {/* Fallback placeholder for thumbnail */}
            <div className="placeholder-bg w-full h-full hidden items-center justify-center">
              <span className={`text-xs ${isDark ? 'text-[#1c1c1c]' : 'text-[#1c1c1c]'}`}>
                {index === 0 ? 'THUMB' : index + 1}
              </span>
            </div>
          </button>
        ))}
        {images.length > 5 && (
          <div className={`w-20 h-16 flex items-center justify-center ${
            isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
          }`}>
            <span className="text-xs">+{images.length - 5}</span>
          </div>
        )}
      </div>
      
      {/* Image counter */}
      <div className="text-center">
        <span className={`text-sm ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>
          {currentIndex + 1} of {images.length}
        </span>
      </div>
    </div>
  );
}