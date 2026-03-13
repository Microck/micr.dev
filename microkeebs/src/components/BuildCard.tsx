import { motion, AnimatePresence } from "framer-motion";
import { KeyboardBuild } from "../types/Build";
import { useTheme } from "../contexts/use-theme";
// import { DecryptedText } from "./DecryptedText";
import { TextType } from "./TextType";
import { LineSwap } from "./LineSwap";

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
  const coverImage = build.images[0] || "";
  const buildDescription = extractBuildDescription(build);
  const smallThumbnail = coverImage
    ? coverImage.replace(/(\.[^.]+)$/, "_sm.webp")
    : "";

  return (
    <div onClick={onClick} className="cursor-pointer cursor-target">
      <div className="w-full h-64 mb-4 overflow-hidden relative">
        <div className={`gallery-media ${isDark ? 'gallery-media--dark' : 'gallery-media--light'}`}>
          {coverImage && (
            <>
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
                src={smallThumbnail}
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
                  if (target.src.includes("_sm.webp")) {
                    target.src = coverImage;
                    return;
                  }
                  target.style.display = "none";
                  const placeholder = target.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = "flex";
                }}
              />
            </>
          )}
          <div className={`placeholder-bg w-full h-full items-center justify-center ${coverImage ? "hidden" : "flex"}`}>
            <span
              className={`text-lg font-normal ${
                isDark ? "text-[#1c1c1c]" : "text-[#1c1c1c]"
              }`}
            >
              {coverImage ? "COVER IMAGE" : "NO IMAGE"}
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

      {/* DecryptedText option (commented out):
      <DecryptedText
        text={build.title}
        animateOn="view"
        sequential={true}
        speed={30}
        delay={200}
        className={`card-title text-lg ${
          isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"
        }`}
        parentClassName="block text-center w-full"
      />
      */}
      
      <div className={`card-title text-lg text-center w-full flex justify-center ${
        isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"
      }`}>
        <LineSwap
          front={
            <TextType 
              text={build.title} 
              typingSpeed={50}
              showCursor={true}
              hideCursorOnComplete={true}
              cursorCharacter="|"
              startOnVisible={true}
              loop={false}
              className="inline-block pr-1"
            />
          }
          back={build.title}
        />
      </div>

      <AnimatePresence>
        {showBuild && buildDescription && (
          <motion.div 
            layout
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 0.7, height: "auto", marginTop: "0.25rem" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`text-xs text-center px-2 leading-relaxed overflow-hidden ${isDark ? "text-[#a7a495]" : "text-[#1c1c1c]"}`}
          >
            {buildDescription}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
