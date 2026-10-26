"use client";

import * as React from "react";
import Image from "next/image";
import {
  CloseIcon,
  DownloadIcon,
  HeartIcon,
  RefreshIcon,
  ShareIcon,
} from "@/components/fomi/icons/FomiIcons";

export interface LightboxImage {
  url: string;
  prompt: string;
  model?: string;
  style?: string;
  aspect?: string;
  seed?: number;
  createdAt?: string;
}

interface LightboxProps {
  image: LightboxImage | null;
  onClose: () => void;
  onRemix?: (image: LightboxImage) => void;
  onStar?: (image: LightboxImage) => void;
  starred?: boolean;
}

/** Full-bleed image viewer with overlay actions. */
export function Lightbox({
  image,
  onClose,
  onRemix,
  onStar,
  starred,
}: LightboxProps) {
  // Lock body scroll while open.
  React.useEffect(() => {
    if (!image) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [image]);

  // ESC to close.
  React.useEffect(() => {
    if (!image) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 text-white/85 text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium truncate">{image.prompt.slice(0, 80)}{image.prompt.length > 80 ? "…" : ""}</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close preview"
          className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <CloseIcon size={18} />
        </button>
      </div>

      {/* Center image */}
      <div
        className="relative max-w-[88vw] max-h-[80vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.url}
          alt={image.prompt}
          width={1200}
          height={1500}
          className="max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
          priority
        />
      </div>

      {/* Bottom action bar */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 glass-panel rounded-full px-2 py-1.5 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <LightboxAction
          icon={<DownloadIcon size={16} />}
          label="Download"
          onClick={() => onDownload(image)}
        />
        <LightboxAction
          icon={<ShareIcon size={16} />}
          label="Share"
          onClick={() => onShare(image)}
        />
        <LightboxAction
          icon={<RefreshIcon size={16} />}
          label="Remix"
          onClick={() => onRemix?.(image)}
        />
        <LightboxAction
          icon={<HeartIcon size={16} />}
          label={starred ? "Unstar" : "Star"}
          active={starred}
          onClick={() => onStar?.(image)}
        />
      </div>
    </div>
  );
}

function LightboxAction({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`h-9 px-3 flex items-center gap-2 rounded-full text-sm transition-colors ${
        active
          ? "bg-fomi-coral text-white"
          : "text-white/85 hover:bg-white/10"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function onDownload(image: LightboxImage) {
  const a = document.createElement("a");
  a.href = image.url;
  a.download = image.url.split("/").pop() ?? "fomi-image.png";
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.click();
}

function onShare(image: LightboxImage) {
  if (navigator.share) {
    navigator
      .share({
        title: "Fomi generation",
        text: image.prompt,
        url: window.location.href,
      })
      .catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
  }
}
