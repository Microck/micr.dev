import React, { useState, useEffect, useRef } from 'react';
import { KeyboardBuild } from '../types/Build';
import { AnimatedIcon } from './icons/AnimatedIcon';
import { useTheme } from '../contexts/ThemeContext';

interface BuildTimelineProps {
  builds: KeyboardBuild[];
  onBuildSelect: (build: KeyboardBuild) => void;
}

interface TimelineMarker {
  build: KeyboardBuild;
  position: number;
  totalBuilds: number;
}

export function BuildTimeline({ builds, onBuildSelect }: BuildTimelineProps) {
  const { isDark } = useTheme();
  const timelineRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<(HTMLDivElement | null)[]>([]);

  // Sort builds by date (newest first)
  const sortedBuilds = [...builds].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).reverse();

  // Calculate positions for timeline
  const calculatePosition = (index: number, total: number) => {
    const totalHeight = 100; // Timeline spans full height
    const spacing = totalHeight / (total + 1);
    const position = spacing * index;
    return position;
  };

  // Animate timeline on mount
  useEffect(() => {
    if (timelineRef.current && markersRef.current) {
      // Animate timeline line
      const timelineHeight = timelineRef.current.offsetHeight;
      markersRef.current.forEach((marker, index) => {
        const targetPosition = calculatePosition(index, sortedBuilds.length);
        const markerPosition = calculatePosition(index, sortedBuilds.length);

        // Set initial position (off-screen)
        gsap.set(marker, {
          y: `${targetPosition}%`,
        ease: 'power2.inOut',
          duration: 0.8,
        delay: index * 0.1,
        });

        // Animate to final position with stagger
        gsap.to(marker, {
          y: `${markerPosition}%`,
          ease: 'power2.inOut',
          duration: 0.6,
          delay: 0.2,
        });
      });

      // Animate timeline line
      gsap.fromTo(timelineRef.current, {
        scaleY: 0,
        duration: 1.2,
        ease: 'power2.inOut',
      });

      gsap.to(timelineRef.current, {
        scaleY: 1,
        duration: 1.2,
        ease: 'power2.inOut',
        delay: 0.4,
      });

      // Animate markers with fade-in
      gsap.fromTo(markersRef.current, {
        opacity: 0,
        y: -20,
      });

      gsap.to(markersRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.05,
        onComplete: () => {
          // Animate timeline line growth
          gsap.to(timelineRef.current, {
            height: 'auto',
            duration: 0.6,
            ease: 'power2.out',
          });
        }
      });
    }
  }, []);

  const handleMarkerClick = (build: KeyboardBuild, index: number) => {
    // Scroll to build with smooth animation
    const targetPosition = calculatePosition(index, sortedBuilds.length);

    if (timelineRef.current) {
      gsap.to(window, {
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (timelineRef.current) {
            const scrollProgress = targetPosition / 100;
            const scrollTo = document.documentElement.scrollHeight * scrollProgress;

            gsap.to(timelineRef.current.parentElement, {
              scrollTop: scrollTo,
              duration: 1.5,
              ease: 'power2.inOut',
            });
          }
        }
      });
    }

    onBuildSelect(build);
  };

  return (
    <div className="relative py-12">
      {/* Timeline Header */}
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}>
          Build Timeline
        </h2>
      </div>

      {/* Timeline Container */}
      <div
        ref={timelineRef}
        className="relative max-w-6xl mx-auto px-4 sm:px-8 lg:px-16 py-8"
        style={{ height: '600px' }}
      >
        {/* Timeline Line */}
        <div
          className={`absolute left-1/2 w-0.5 h-px bg-gradient-to-b ${
            isDark ? 'from-yellow-600 via-yellow-400' : 'from-yellow-500 via-yellow-300'
          } transform -translate-y-1/2`}
          style={{
            top: '0',
            height: '100%'
          }}
        />

        {/* Timeline Markers */}
        {sortedBuilds.map((build, index) => (
          <div
            key={build.id}
            ref={(el) => {
              if (el) markersRef.current[index] = el;
            }}
            className={`absolute w-6 h-8 transform -translate-y-full transition-all duration-500 cursor-pointer ${
              isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
            } hover:scale-105 ${
              isDark ? 'hover:bg-[#a7a495]/20' : 'hover:bg-[#1c1c1c]/10'
            }`}
            onClick={() => handleMarkerClick(build, index)}
            style={{
              top: `${calculatePosition(index, sortedBuilds.length)}%`
            }}
          >
            {/* Thumbnail */}
            <div
              className={`w-12 sm:w-16 h-9 sm:h-12 overflow-hidden rounded-lg shadow-lg bg-gradient-to-br from-[#b5b3a7] via-[#8b5cf6] to-[#1c1c1c] dark:bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 ${
                isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
              }`}
            >
              <img
                src={build.images[0]}
                alt={build.title}
                className="w-full h-full object-cover transition-opacity duration-300 opacity-0"
                loading="eager"
                decoding="sync"
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.classList.remove('opacity-0');
                  const skeleton = target.previousElementSibling as HTMLElement;
                  if (skeleton) skeleton.style.display = 'none';
                }}
                onError={() => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const placeholder = target.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />

              {/* Hover Details */}
              <div className="absolute inset-0 hidden items-center justify-center rounded bg-black/80 text-white p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className={`text-sm uppercase tracking-wider ${
                  isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
                }`}>
                  {build.title}
                </span>
              </div>

              {/* Timeline Marker */}
              <div
                className={`absolute left-1/2 transform -translate-y-full transition-transform duration-500 ${
                  isDark ? 'bg-[#a7a495]' : 'bg-[#1c1c1c]'
                } rounded-full p-1 flex items-center justify-center ${
                  isDark ? 'border-[#a7a495]' : 'border-[#1c1c1c]'
                } shadow-xl`}
                style={{
                  top: `${calculatePosition(index, sortedBuilds.length)}%`
                }}
              >
                <AnimatedIcon
                  name="calendar"
                  size={20}
                  className={`text-[#a7a495] ${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'}`}
                />
                <div className={`text-xs font-medium ${
                  isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'
                }`}>
                  {new Date(build.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}