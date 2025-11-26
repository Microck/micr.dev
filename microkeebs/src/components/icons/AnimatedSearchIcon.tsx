import React from "react";

interface AnimatedSearchIconProps {
  size?: number;
  className?: string;
}

export const AnimatedSearchIcon: React.FC<AnimatedSearchIconProps> = ({
  size = 20,
  className = "",
}) => {
  const classes = ["search-icon", className].filter(Boolean).join(" ");

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
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth="2"
        className="search-circle"
      />
      <line
        x1="16.5"
        y1="16.5"
        x2="21"
        y2="21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="search-handle"
      />
    </svg>
  );
};
