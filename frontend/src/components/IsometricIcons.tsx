import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Chunky extruded Isometric Shield Icon
 */
export const IsometricShield: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 hover:scale-105 ${className}`}
  >
    {/* Shadow */}
    <ellipse cx="32" cy="54" rx="22" ry="7" fill="#000000" fillOpacity="0.35" />
    {/* Extruded side / 3D depth */}
    <path
      d="M32 48L16 38V16L32 10L48 16V38L32 48Z"
      fill="var(--icon-side)"
      stroke="var(--icon-ink)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Front face with bevel */}
    <path
      d="M32 44L18 35V18L32 12L46 18V35L32 44Z"
      fill="var(--icon-face)"
      stroke="var(--icon-ink)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Accent core glow */}
    <path
      d="M32 38L22 32V22L32 18L42 22V32L32 38Z"
      fill="var(--icon-accent)"
      fillOpacity="0.25"
      stroke="var(--icon-accent)"
      strokeWidth="1.5"
    />
    {/* Checkmark crest */}
    <path
      d="M27 28L31 32L37 25"
      stroke="var(--primary-tint)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Chunky extruded Isometric Terminal Icon
 */
export const IsometricTerminal: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 hover:scale-105 ${className}`}
  >
    <ellipse cx="32" cy="54" rx="24" ry="7" fill="#000000" fillOpacity="0.35" />
    {/* Bottom/Side Extrusion */}
    <path
      d="M12 24L32 14L52 24V38L32 48L12 38V24Z"
      fill="var(--icon-side)"
      stroke="var(--icon-ink)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Top Face */}
    <path
      d="M12 24L32 14L52 24L32 34L12 24Z"
      fill="var(--icon-face)"
      stroke="var(--icon-ink)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Screen glow */}
    <polygon points="16,24 32,16 48,24 32,32" fill="rgba(15, 23, 42, 0.9)" />
    {/* Prompt caret */}
    <path
      d="M24 22L28 24L24 26"
      stroke="var(--icon-accent)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="31"
      y1="25"
      x2="37"
      y2="28"
      stroke="var(--accent)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Chunky extruded Isometric Stopwatch Icon
 */
export const IsometricStopwatch: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 hover:scale-105 ${className}`}
  >
    <ellipse cx="32" cy="54" rx="20" ry="6" fill="#000000" fillOpacity="0.35" />
    {/* Top button stem */}
    <path d="M30 10L34 8L36 12L32 14Z" fill="var(--icon-side)" stroke="var(--icon-ink)" strokeWidth="1.5" />
    {/* Outer cylinder depth */}
    <path
      d="M14 30C14 41 22 50 32 50C42 50 50 41 50 30V24C50 35 42 44 32 44C22 44 14 35 14 24V30Z"
      fill="var(--icon-side)"
      stroke="var(--icon-ink)"
      strokeWidth="2"
    />
    {/* Top Face Dial */}
    <ellipse
      cx="32"
      cy="24"
      rx="18"
      ry="12"
      fill="var(--icon-face)"
      stroke="var(--icon-ink)"
      strokeWidth="2"
    />
    {/* Inner glowing circle */}
    <ellipse cx="32" cy="24" rx="14" ry="9" fill="rgba(15, 23, 42, 0.7)" />
    {/* Hand pointing to danger */}
    <line
      x1="32"
      y1="24"
      x2="40"
      y2="20"
      stroke="var(--warning)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="32" cy="24" r="2" fill="var(--icon-accent)" />
  </svg>
);

/**
 * Chunky extruded Isometric Warning Icon
 */
export const IsometricWarning: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 hover:scale-105 ${className}`}
  >
    <ellipse cx="32" cy="54" rx="22" ry="6" fill="#000000" fillOpacity="0.35" />
    {/* Extruded prism depth */}
    <path
      d="M32 10L10 46L32 48L54 46L32 10Z"
      fill="var(--icon-side)"
      stroke="var(--icon-ink)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Front face */}
    <path
      d="M32 14L14 44L50 44L32 14Z"
      fill="rgba(245, 158, 11, 0.15)"
      stroke="var(--warning)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Exclamation point */}
    <line x1="32" y1="24" x2="32" y2="34" stroke="var(--warning)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="39" r="1.5" fill="var(--warning)" />
  </svg>
);

/**
 * Chunky extruded Isometric Padlock Icon
 */
export const IsometricPadlock: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 hover:scale-105 ${className}`}
  >
    <ellipse cx="32" cy="55" rx="22" ry="7" fill="#000000" fillOpacity="0.35" />
    {/* Shackle */}
    <path
      d="M24 24V18C24 13.58 27.58 10 32 10C36.42 10 40 13.58 40 18V24"
      stroke="var(--primary-tint)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* 3D Extruded Body */}
    <path
      d="M16 28L32 18L48 28V44L32 54L16 44V28Z"
      fill="var(--icon-side)"
      stroke="var(--icon-ink)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M16 28L32 18L48 28L32 38L16 28Z"
      fill="var(--icon-face)"
      stroke="var(--icon-ink)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Keyhole */}
    <circle cx="32" cy="42" r="3" fill="var(--icon-accent)" />
    <polygon points="31,43 33,43 34,48 30,48" fill="var(--icon-accent)" />
  </svg>
);
