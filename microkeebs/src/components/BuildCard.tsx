import React from "react";
import { KeyboardBuild } from "../types/Build";
import { useTheme } from "../contexts/ThemeContext";

interface BuildCardProps {
  build: KeyboardBuild;
  onClick: () => void;
  showBuild?: boolean;
}

const extractBuildDescription = (build: KeyboardBuild): string => {
  const sourceTitle = build.youtubeTitle || build.title;
  const lowerCaseTitle = sourceTitle.toLowerCase();

  if (build.category === "EC") {
    if (lowerCaseTitle.startsWith("lubed and silenced")) return "Lubed and Silenced";
    if (lowerCaseTitle.startsWith("lubed")) return "Lubed";
    if (lowerCaseTitle.startsWith("stock")) return "Stock";
  } else if (build.category === "MX") {
    const prefixes = [" with lubed ", " with stock ", " with ", " con lubed ", " con stock ", " con "];
    for (const prefix of prefixes) {
      const index = lowerCaseTitle.indexOf(prefix);
      if (index !== -1) {
        return sourceTitle.substring(index + prefix.length).trim();
      }
    }
  }
  return "";
};

export function BuildCard({ build, onClick, showBuild = false }: BuildCardProps) {
  const { isDark } = useTheme();
  const coverImage = build.images[0];
  const buildDescription = extractBuildDescription(build);

  return (
    <div onClick={onClick} className="cursor-pointer card-hover group">
      {/* Restored original h-64 class as requested */}
      <div className="w-full h-64 mb-4 overflow-hidden">
        <img
          src={coverImage}
          alt={build.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const placeholder = target.nextElementSibling as HTMLElement;
            if (placeholder) placeholder.style.display = "flex";
          }}
        />
        <div className="placeholder-bg w-full h-full hidden items-center justify-center">
          <span className={`text-lg font-normal ${isDark ? "text-[#1c1c1c]" : "text-[#1c1c1c]"}`}>
            COVER IMAGE
          </span>
        </div>
      </div>

      <h3 className={`card-title text-lg text-center slide-up ${isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"}`}>
        {build.title}
      </h3>

      {showBuild && buildDescription && (
        <p className={`text-xs text-center mt-1 px-2 leading-relaxed ${isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"} opacity-70`}>
          {buildDescription}
        </p>
      )}
    </div>
  );
}