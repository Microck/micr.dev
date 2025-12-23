import { useState, useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  range?: number;
  className?: string;
}

const Magnetic = ({ children, strength = 0.2, range = 50, className = "" }: MagneticProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < range) {
      x.set(distanceX * strength);
      y.set(distanceY * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      whileDrag={{ cursor: "grabbing" }}
      style={{ x: springX, y: springY, touchAction: "none" }}
      className={`${className} cursor-grab`}
    >
      {children}
    </motion.div>
  );
};

interface LogoWallProps {
  items: React.ReactNode[];
  direction?: "horizontal" | "vertical";
  pauseOnHover?: boolean;
  size?: string;
  duration?: string;
  textColor?: string;
  bgColor?: string;
  bgAccentColor?: string;
  gap?: string;
  fadeStart?: string;
  fadeEnd?: string;
  fadeLeft?: string;
  fadeRight?: string;
}

const LogoWall = ({
  items,
  direction = "horizontal",
  pauseOnHover = false,
  size = "clamp(8rem, 1rem + 20vmin, 25rem)",
  duration = "60s",
  textColor = "#ffffff",
  bgColor = "#060606",
  bgAccentColor = "#111111",
  gap = "2rem",
  fadeStart = "20%",
  fadeEnd = "80%",
  fadeLeft,
  fadeRight,
}: LogoWallProps) => {
  const [isPaused, setIsPaused] = useState(false);

  const wrapperClass = [
    "flex",
    "flex-col",
    "gap-[calc(var(--size)/14)]",
    "mx-auto",
    "max-w-full",
    "p-[20px_10px]",
    direction === "vertical" && "flex-row justify-center h-full",
  ]
    .filter(Boolean)
    .join(" ");

  const marqueeClass = [
    "relative",
    "flex",
    "overflow-hidden",
    "select-none",
    "justify-start",
    "w-full",
    "mask-horizontal",
    direction === "vertical" && "flex-col h-full mask-vertical",
    isPaused && "paused",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={wrapperClass}
      style={{
        ["--size" as string]: size,
        ["--duration" as string]: duration,
        ["--color-text" as string]: textColor,
        ["--color-bg" as string]: bgColor,
        ["--color-bg-accent" as string]: bgAccentColor,
        ["--gap" as string]: gap,
        ["--fade-start" as string]: fadeStart,
        ["--fade-end" as string]: fadeEnd,
        ["--fade-left" as string]: fadeLeft || fadeStart,
        ["--fade-right" as string]: fadeRight || fadeEnd,
        color: "var(--color-text)",
        backgroundColor: "var(--color-bg)",
      }}
    >
      <div
        className={marqueeClass}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        <div
          className={`flex-shrink-0 flex items-center justify-start min-w-full marquee-group ${
            direction === "vertical" ? "flex-col min-h-full" : ""
          }`}
          style={{ gap: "var(--gap)" }}
        >
          {items.map((item, idx) => (
            <Magnetic key={idx} className="flex items-center justify-center pointer-events-auto">
              <div>{item}</div>
            </Magnetic>
          ))}
        </div>
        <div
          aria-hidden="true"
          className={`flex-shrink-0 flex items-center justify-start min-w-full marquee-group ${
            direction === "vertical" ? "flex-col min-h-full" : ""
          }`}
          style={{ gap: "var(--gap)" }}
        >
          {items.map((item, idx) => (
            <Magnetic key={`dup1-${idx}`} className="flex items-center justify-center pointer-events-auto">
              <div>{item}</div>
            </Magnetic>
          ))}
        </div>
      </div>
      
      <style>{`
        .marquee-group {
          animation: scroll-x var(--duration) linear infinite;
        }

        .mask-horizontal {
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black var(--fade-left),
            black var(--fade-right),
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black var(--fade-left),
            black var(--fade-right),
            transparent 100%
          );
        }

        .mask-vertical {
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black var(--fade-start),
            black var(--fade-end),
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black var(--fade-start),
            black var(--fade-end),
            transparent 100%
          );
        }

        @keyframes scroll-x {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }

        @keyframes scroll-y {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(calc(-100% - var(--gap)));
          }
        }

        /* Vertical animation modifier */
        .mask-vertical .marquee-group {
          animation-name: scroll-y;
        }

        .paused .marquee-group {
          animation-play-state: paused !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-group {
            animation-play-state: paused;
          }
        }
      `}</style>
    </article>
  );
};

export default LogoWall;
