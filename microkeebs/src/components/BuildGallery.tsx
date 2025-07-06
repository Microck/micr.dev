import React, { useState } from "react";
import { BuildCard } from "./BuildCard";
import { Footer } from "./Footer";
import { useTheme } from "../contexts/ThemeContext";
import { BuildWithSlug } from "../utils/slugs"; // Import the new type

interface BuildGalleryProps {
  builds: BuildWithSlug[]; // Use the new type
}

export function BuildGallery({ builds }: BuildGalleryProps) {
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [showBuild, setShowBuild] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilter, setActiveFilter] = useState("All");
  const { isDark } = useTheme();

  const filteredBuilds = builds.filter((build) => {
    if (activeFilter === "All") return true;
    return build.category === activeFilter;
  });

  const sortedBuilds = [...filteredBuilds].sort((a, b) => {
    if (sortBy === "newest") {
      // Timestamps are already sorted, but we re-sort based on user selection
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  return (
    <div className={`${isDark ? "bg-[#1c1c1c]" : "bg-[#a7a495]"} min-h-screen`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Controls (unchanged) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-12 fade-in">
          {/* ... (all your filter/sort controls remain here) ... */}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sortedBuilds.map((build) => (
            <div key={build.id}>
              {/* The onClick prop is removed, navigation is handled inside BuildCard */}
              <BuildCard
                build={build}
                showBuild={showBuild}
              />
              {showTimestamps && (
                <div className={`text-xs text-center mt-2 ${isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"}`}>
                  {new Date(build.timestamp).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}