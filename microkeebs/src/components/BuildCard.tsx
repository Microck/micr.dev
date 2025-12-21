import { motion } from "framer-motion";
import { KeyboardBuild } from "../types/Build";
import { useTheme } from "../contexts/ThemeContext";
import { MaskedText } from "./MaskedText";

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
    <div onClick={onClick} className="cursor-pointer cursor-target">
      <div className="w-full h-64 mb-4 overflow-hidden relative">
        <div className={`gallery-media ${isDark ? 'gallery-media--dark' : 'gallery-media--light'}`}>
          <div
            className={`absolute inset-0 animate-pulse ${
              isDark ? "bg-[#2a2a2a]" : "bg-[#b5b3a7]"
            }`}
          >
            <div
              className={`w-full h-full flex items-center justify-center ${
                isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"
              }`}
            >
              <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          <img
            src={coverImage}
            alt={build.title}
            className="gallery-media__image opacity-0"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
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
          <div className="placeholder-bg w-full h-full hidden items-center justify-center">
            <span
              className={`text-lg font-normal ${
                isDark ? "text-[#1c1c1c]" : "text-[#1c1c1c]"
              }`}
            >
              COVER IMAGE
            </span>
          </div>
          <div className="gallery-media__corner gallery-media__corner--tl"></div>
          <div className="gallery-media__corner gallery-media__corner--tr"></div>
          <div className="gallery-media__corner gallery-media__corner--bl"></div>
          <div className="gallery-media__corner gallery-media__corner--br"></div>
          <div className="gallery-media__edge gallery-media__edge--top"></div>
          <div className="gallery-media__edge gallery-media__edge--right"></div>
          <div className="gallery-media__edge gallery-media__edge--bottom"></div>
          <div className="gallery-media__edge gallery-media__edge--left"></div>
        </div>
      </div>

      <MaskedText
        className={`card-title text-lg text-center ${
          isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"
        }`}
        delay={100}
      >
        {build.title}
      </MaskedText>

      <motion.div 
        layout
        transition={{ layout: { duration: 0.3, ease: "easeOut" } }}
        className={`text-xs text-center px-2 leading-relaxed overflow-hidden ${
          showBuild && buildDescription ? 'opacity-70' : 'opacity-0'
        } ${isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"}`}
        style={{
          height: showBuild && buildDescription ? 'auto' : 0,
          marginTop: showBuild && buildDescription ? '0.25rem' : 0,
        }}
      >
        {buildDescription}
      </motion.div>
    </div>
  );
}