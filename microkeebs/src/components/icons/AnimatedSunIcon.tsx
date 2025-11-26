import React from "react";

interface AnimatedSunIconProps {
  size?: number;
  className?: string;
}

export const AnimatedSunIcon: React.FC<AnimatedSunIconProps> = ({
  size = 24,
  className = "",
}) => {
  const classes = ["sun-icon", className].filter(Boolean).join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={classes}
      fill="none"
      role="img"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="4.5"
        stroke="currentColor"
        strokeWidth="2"
        className="sun-core"
      />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="sun-rays">
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="4.5" y1="4.5" x2="6.6" y2="6.6" />
        <line x1="17.4" y1="17.4" x2="19.5" y2="19.5" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
        <line x1="4.5" y1="19.5" x2="6.6" y2="17.4" />
        <line x1="17.4" y1="6.6" x2="19.5" y2="4.5" />
      </g>
    </svg>
  );
};
