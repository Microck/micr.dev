import React from "react";

interface AnimatedMoonIconProps {
  size?: number;
  className?: string;
}

export const AnimatedMoonIcon: React.FC<AnimatedMoonIconProps> = ({
  size = 24,
  className = "",
}) => {
  const classes = ["moon-icon", className].filter(Boolean).join(" ");

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
      <path
        d="M21 12.8A9 9 0 0 1 11.2 3 7 7 0 1 0 21 12.8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="moon-body"
      />
      <circle cx="16.5" cy="6.5" r="0.9" fill="currentColor" className="moon-star" />
      <circle cx="18.5" cy="10" r="0.6" fill="currentColor" className="moon-star" />
      <circle cx="14.5" cy="4.5" r="0.5" fill="currentColor" className="moon-star" />
    </svg>
  );
};
