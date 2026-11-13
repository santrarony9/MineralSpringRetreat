import React from 'react';

// Exact 3-color geometric logo from Wix Boutique Hotel Template 3561
export function WixLogo({ className = "w-6 h-6", footer = false }) {
  const color1 = "#F2DC8D"; // Yellow
  const color2 = footer ? "#8DC3DF" : "#F55956"; // Blue in footer, Coral in header
  const color3 = footer ? "#525624" : "#EC6A9B"; // Olive in footer, Pink in header

  return (
    <svg
      viewBox="20 20 160 160"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mineral Springs Retreat Logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        {/* Top semi-circle/pill */}
        <path
          d="M20 20h120c22.091 0 40 17.909 40 40s-17.909 40-40 40H20z"
          fill={color1}
        />
        {/* Right curved element */}
        <path
          d="M140 180c-22.091 0-40-17.909-40-40s17.909-40 40-40 40 17.909 40 40-17.909 40-40 40"
          fill={color2}
        />
        {/* Bottom square/block */}
        <path
          d="M100 180H20v-80h80z"
          fill={color3}
        />
      </g>
    </svg>
  );
}

// 6-pointed starburst / asterism symbol used in Wix Template 3561
export function WixStarburst({ className = "w-3.5 h-3.5", color = "currentColor" }) {
  return (
    <svg
      viewBox="20 25 160 150"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
    >
      <path d="m180 90.8-10.2-28.3-55.3 19.4V25H85v57.4L30.2 62.5 20 90.8l55.9 18.1-34.8 48L67 175l33.5-49.7 33.3 49.7 25.1-18.1-34.3-48z" />
    </svg>
  );
}
