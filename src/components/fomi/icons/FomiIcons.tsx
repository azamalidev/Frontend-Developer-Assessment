"use client";

import * as React from "react";

/**
 * FomiIcons — a small, opinionated SVG icon set tuned for the Fomi brand.
 * - 1.5px stroke weight for crispness at small sizes
 * - Uses currentColor so the parent's text color cascades through
 * - Each icon is keyboard-safe and aria-hidden (decorative by default)
 *
 * These are not generic outline icons; they're tuned for the Fomi voice:
 * slightly geometric, friendly, and consistent in optical weight.
 */

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  title?: string;
}

function base({ size = 20, title, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    role: title ? "img" : undefined,
    "aria-hidden": title ? undefined : "true",
    "aria-label": title,
    ...props,
  };
}

export function HomeIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3.5 11.5 12 4l8.5 7.5" />
      <path d="M5 10.5V20h5v-5h4v5h5v-9.5" />
    </svg>
  );
}

export function ImageIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m3.5 17 5-4.5 4 3 4.5-4 3.5 3" />
    </svg>
  );
}

export function VideoIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="2.5" y="5.5" width="14" height="13" rx="2.5" />
      <path d="M17 9.5 21.5 7v10L17 14.5" />
    </svg>
  );
}

export function EditIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 20h4L18.5 9.5a2.83 2.83 0 0 0-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

export function MusicIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M9 18a2.5 2.5 0 1 1-2.5-2.5V4l11-2v11.5" />
      <path d="M9 18a2.5 2.5 0 1 1-2.5-2.5" />
      <path d="M17.5 13.5a2.5 2.5 0 1 1-2.5 2.5" />
    </svg>
  );
}

export function GalleryIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function SupportIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <path d="M4 13h2v6H5a1 1 0 0 1-1-1v-5Z" />
      <path d="M20 13h-2v6h1a1 1 0 0 0 1-1v-5Z" />
      <path d="M12 18v2.5" />
    </svg>
  );
}

export function UserIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1-3.5 4-5.5 7.5-5.5s6.5 2 7.5 5.5" />
    </svg>
  );
}

export function SparkleIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3.5 13.8 9 19 10.8 13.8 12.6 12 18 10.2 12.6 5 10.8 10.2 9 12 3.5Z" />
      <path d="M19 14.5 19.7 16.5 21.7 17.2 19.7 17.9 19 19.9 18.3 17.9 16.3 17.2 18.3 16.5 19 14.5Z" />
    </svg>
  );
}

export function ChevronDownIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function PlusIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CloseIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 6 18 18M18 6 6 18" />
    </svg>
  );
}

export function SearchIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

export function HeartIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 20s-7-4.6-7-10a3.5 3.5 0 0 1 7-1.5A3.5 3.5 0 0 1 19 10c0 5.4-7 10-7 10Z" />
    </svg>
  );
}

export function DownloadIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 4v10m0 0 4-4m-4 4-4-4" />
      <path d="M5 19h14" />
    </svg>
  );
}

export function ShareIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="6.5" cy="12" r="2" />
      <circle cx="17.5" cy="6" r="2" />
      <circle cx="17.5" cy="18" r="2" />
      <path d="m8 11 8-4M8 13l8 4" />
    </svg>
  );
}

export function MoreIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SlidersIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 7h10M4 17h6" />
      <path d="M16 7h4M14 17h6" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="13" cy="17" r="2" />
    </svg>
  );
}

export function PaletteIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3a9 9 0 1 0 9 9c0-1.4-1-2-2.3-2h-1.7c-1.5 0-2-1-2-2V6.7C15 5 14 3 12 3Z" />
      <circle cx="8" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="11" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="9" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LayersIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 4 4 8l8 4 8-4-8-4Z" />
      <path d="M4 12l8 4 8-4" />
      <path d="M4 16l8 4 8-4" />
    </svg>
  );
}

export function ClockIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function FolderIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 6.5C4 5.7 4.7 5 5.5 5h3.6c.5 0 1 .2 1.4.6l1.6 1.4H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6.5Z" />
    </svg>
  );
}

export function PlayIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

export function ArrowRightIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 12h14m-5-5 5 5-5 5" />
    </svg>
  );
}

export function RefreshIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 12a8 8 0 0 1 13.5-5.5L20 8" />
      <path d="M20 4v4h-4" />
      <path d="M20 12a8 8 0 0 1-13.5 5.5L4 16" />
      <path d="M4 20v-4h4" />
    </svg>
  );
}

export function FullscreenIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 9V5h4M19 9V5h-4M5 15v4h4M19 15v4h-4" />
    </svg>
  );
}

export function GridIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
    </svg>
  );
}

export function WandIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 19 17 7" />
      <path d="m14 4 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" />
      <path d="M5 19.5 6.5 21" />
    </svg>
  );
}

export function ImageIconAlt(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m3.5 17 5-4.5 4 3 4.5-4 3.5 3" />
    </svg>
  );
}

export function CheckIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m5 12 5 5 9-10" />
    </svg>
  );
}

export function StarIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m12 4 2.5 5 5.5.8-4 4 1 5.5L12 17l-5 2.3 1-5.5-4-4 5.5-.8L12 4Z" />
    </svg>
  );
}

export function SpinnerIcon(p: IconProps) {
  return (
    <svg {...base(p)} className={`animate-spin ${p.className ?? ""}`}>
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}
