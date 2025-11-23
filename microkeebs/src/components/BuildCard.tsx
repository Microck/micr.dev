import React from "react";
import { KeyboardBuild } from "../types/Build";
import { useTheme } from "../contexts/ThemeContext";
import { AuraSparkleIcon, AuraStarIcon } from "./icons";
import { AuraSpinner } from "./AuraSpinner";

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
    const prefixes = [
      " with unlubed ",
      " with dry ",
      " with lubed ",
      " with stock ",
      " with ",
      " con lubed ",
      " con stock ",
      " con ",
    ];
    for (const prefix of prefixes) {
      const index = lowerCaseTitle.indexOf(prefix);
      if (index !== -1) {
        return sourceTitle.substring(index + prefix.length).trim();
      }
    }
  }
  return "";
};

export function BuildCard({
  build,
  onClick,
  showBuild = false,
}: BuildCardProps) {
  const { isDark } = useTheme();
  const coverImage = build.images[0];
  const buildDescription = extractBuildDescription(build);

  return (
    <div onClick={onClick} className="cursor-pointer aura-morph group">
      <div className="w-full h-64 mb-4 overflow-hidden relative rounded-lg">
        {/* Loading skeleton */}
        <div
          className={`absolute inset-0 animate-pulse rounded-lg ${
            isDark ? "bg-[#2a2a2a]" : "bg-[#b5b3a7]"
          }`}
        >
          <div
            className={`w-full h-full flex items-center justify-center ${
              isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"
            }`}
          >
            <AuraSpinner size="medium" />
          </div>
        </div>
        <img
          src={coverImage}
          alt={build.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 transition-opacity duration-300 opacity-0 rounded-lg"
          loading="eager"
          decoding="sync"
          onLoad={(e) => {
            const target = e.target as HTMLImageElement;
            target.classList.remove("opacity-0");
            const skeleton = target.previousElementSibling as HTMLElement;
            if (skeleton) skeleton.style.display = "none";
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const placeholder = target.nextElementSibling as HTMLElement;
            if (placeholder) placeholder.style.display = "flex";
          }}
        />
        <div className="placeholder-bg w-full h-full hidden items-center justify-center rounded-lg">
          <span
            className={`text-lg font-normal ${
              isDark ? "text-[#1c1c1c]" : "text-[#1c1c1c]"
            }`}
          >
            COVER IMAGE
          </span>
        </div>
        
        {/* Floating sparkle icon */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <AuraSparkleIcon 
            size={16} 
            className={`${isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]'} drop-shadow-lg`}
          />
        </div>
      </div>

      <h3
        className={`card-title text-lg text-center aura-slide ${
          isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          <AuraStarIcon size={16} className="opacity-70" />
          {build.title}
          <AuraStarIcon size={16} className="opacity-70" />
        </span>
      </h3>

      {showBuild && buildDescription && (
        <p
          className={`text-xs text-center mt-1 px-2 leading-relaxed ${
            isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"
          } opacity-70`}
        >
          {buildDescription}
        </p>
      )}
    </div>
  );
}