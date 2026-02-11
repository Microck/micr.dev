import { useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { SearchIcon } from "@/components/ui/search";
import { BuildCard } from "./BuildCard";
import { Footer } from "./Footer";
import { useTheme } from "../contexts/ThemeContext";
import { KeyboardBuild } from "../types/Build";
import builds from "../data/builds.json";

interface BuildGalleryProps {
  onBuildSelect: (build: KeyboardBuild) => void;
}

export function BuildGallery({ onBuildSelect }: BuildGalleryProps) {
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [showBuild, setShowBuild] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const { isDark } = useTheme();

  const typedBuilds = builds as unknown as KeyboardBuild[];

  const filteredBuilds = typedBuilds.filter((build) => {
    const matchesFilter = activeFilter === "All" || build.category === activeFilter;
    const matchesSearch = searchQuery === "" || 
      build.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (build.youtubeTitle && build.youtubeTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const sortedBuilds = [...filteredBuilds].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  return (
    <div className={`${isDark ? "bg-[#1c1c1c]" : "bg-[#a7a495]"} min-h-screen`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          {/* Show timestamps toggle */}
          <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
            <div className="relative">
              <input type="checkbox" checked={showTimestamps} onChange={(e) => setShowTimestamps(e.target.checked)} className="sr-only" />
              <div className={`w-4 h-4 border transition-all duration-300 ${showTimestamps ? (isDark ? "bg-[#a7a495] scale-110 border-[#a7a495]" : "bg-[#1c1c1c] scale-110 border-[#1c1c1c]") : isDark ? "bg-[#2a2a2a] border-[#a7a495]" : "bg-[#b5b3a7] border-[#1c1c1c]"}`}>
                {showTimestamps && <div className="w-full h-full flex items-center justify-center"><div className={`w-2 h-2 ${isDark ? "bg-[#1c1c1c]" : "bg-[#b5b3a7]"}`}></div></div>}
              </div>
            </div>
            <span className={`text-sm font-normal ${isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"}`}>Show timestamps</span>
          </label>

          {/* Show build toggle */}
          <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
            <div className="relative">
              <input type="checkbox" checked={showBuild} onChange={(e) => setShowBuild(e.target.checked)} className="sr-only" />
              <div className={`w-4 h-4 border transition-all duration-300 ${showBuild ? (isDark ? "bg-[#a7a495] scale-110 border-[#a7a495]" : "bg-[#1c1c1c] scale-110 border-[#1c1c1c]") : isDark ? "bg-[#2a2a2a] border-[#a7a495]" : "bg-[#b5b3a7] border-[#1c1c1c]"}`}>
                {showBuild && <div className="w-full h-full flex items-center justify-center"><div className={`w-2 h-2 ${isDark ? "bg-[#1c1c1c]" : "bg-[#b5b3a7]"}`}></div></div>}
              </div>
            </div>
            <span className={`text-sm font-normal ${isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"}`}>Show build</span>
          </label>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className={`text-sm font-normal ${isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"}`}>Sort by:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`border px-3 py-1 text-sm transition-all duration-300 ease-out cursor-pointer hover:scale-105 hover:-translate-y-0.5 ${isDark ? "bg-[#2a2a2a] border-[#a7a495] text-[#a7a495]" : "bg-[#b5b3a7] border-[#1c1c1c] text-[#1c1c1c]"}`}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          {/* Filter buttons */}
          <div className="flex items-center">
            <button onClick={() => setActiveFilter("All")} className={`px-4 py-1 text-sm font-normal transition-all duration-300 ease-out ${activeFilter === "All" ? (isDark ? "bg-[#a7a495] text-[#1c1c1c]" : "bg-[#1c1c1c] text-[#b5b3a7]") : isDark ? "bg-[#2a2a2a] text-[#a7a495] hover:opacity-70" : "bg-[#b5b3a7] text-[#1c1c1c] hover:opacity-70"}`}>
              All
            </button>
            <button onClick={() => setActiveFilter("MX")} className={`px-4 py-1 text-sm font-normal transition-all duration-300 ease-out ${activeFilter === "MX" ? (isDark ? "bg-[#a7a495] text-[#1c1c1c]" : "bg-[#1c1c1c] text-[#b5b3a7]") : isDark ? "bg-[#2a2a2a] text-[#a7a495] hover:opacity-70" : "bg-[#b5b3a7] text-[#1c1c1c] hover:opacity-70"}`}>
              MX
            </button>
            <button onClick={() => setActiveFilter("EC")} className={`px-4 py-1 text-sm font-normal transition-all duration-300 ease-out ${activeFilter === "EC" ? (isDark ? "bg-[#a7a495] text-[#1c1c1c]" : "bg-[#1c1c1c] text-[#b5b3a7]") : isDark ? "bg-[#2a2a2a] text-[#a7a495] hover:opacity-70" : "bg-[#b5b3a7] text-[#1c1c1c] hover:opacity-70"}`}>
              EC
            </button>
          </div>

          {/* Search bar - pushed to the right */}
          <div className="ml-auto">
            <div 
              className="relative flex items-center"
              onMouseEnter={() => setSearchExpanded(true)}
              onMouseLeave={() => {
                if (!searchQuery) setSearchExpanded(false);
              }}
            >
              <input
                type="text"
                placeholder="Search keyboards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchExpanded(true)}
                onBlur={() => {
                  if (!searchQuery) setSearchExpanded(false);
                }}
                className={`border-b-2 px-0 py-2 text-sm transition-all duration-500 ease-out focus:outline-none bg-transparent ${
                  searchExpanded ? "w-64 opacity-100" : "w-0 opacity-0"
                } ${isDark ? "border-[#a7a495] text-[#a7a495] placeholder-[#a7a495]/50" : "border-[#1c1c1c] text-[#1c1c1c] placeholder-[#1c1c1c]/50"}`}
              />
              <SearchIcon
                size={20}
                className={`transition-all duration-300 ease-out cursor-pointer ${
                  isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"
                } ${searchExpanded ? "ml-2" : ""}`}
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        <LayoutGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sortedBuilds.map((build, index) => {
              const isInitialLoad = index < 9;
              const delay = isInitialLoad ? index * 0.1 : 0;
              
              return (
              <motion.div 
                key={build.id} 
                layout
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  layout: { duration: 0.3, ease: "easeOut" },
                  opacity: { duration: 0.6, delay },
                  y: { duration: 0.6, delay }
                }}
              >
                <BuildCard
                  build={build}
                  onClick={() => onBuildSelect(build)}
                  showBuild={showBuild}
                />
                <AnimatePresence>
                  {showTimestamps && (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: "0.5rem" }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`text-xs text-center overflow-hidden ${isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"}`}
                    >
                      {new Date(build.timestamp).toLocaleDateString()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );})}
          </div>
        </LayoutGroup>
      </div>
      <Footer />
    </div>
  );
}