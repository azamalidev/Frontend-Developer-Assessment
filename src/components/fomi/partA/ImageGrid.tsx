"use client";

import * as React from "react";
import Image from "next/image";
import { Lightbox, LightboxImage } from "@/components/fomi/shared/Lightbox";
import { SEED_THUMBNAILS } from "@/components/fomi/lib/constants";
import { ImageSkeleton } from "./ImageSkeleton";

export interface GeneratedTile {
  id: string;
  url: string;
  prompt: string;
  model?: string;
  style?: string;
  aspect?: string;
  seed?: number;
  createdAt?: string;
}

interface ImageGridProps {
  /** Tiles currently rendered. When count > tiles.length, skeletons fill the rest. */
  tiles: GeneratedTile[];
  /** Number of skeleton slots to render while loading. */
  pendingCount: number;
  /** When true, show empty-state copy with prompt examples. */
  hasError?: boolean;
  onRetry?: () => void;
}

/**
 * Image grid for Part A — a responsive 2x4 layout of portrait tiles.
 * Includes a top "Recently used" thumbnail strip and a lightbox viewer.
 */
export function ImageGrid({
  tiles,
  pendingCount,
  hasError,
  onRetry,
}: ImageGridProps) {
  const [lightbox, setLightbox] = React.useState<LightboxImage | null>(null);

  // Build a masonry-style column layout: distribute tiles across N columns
  // based on viewport. Tiles flow vertically inside each column.
  return (
    <section
      aria-label="Generated images"
      className="flex flex-col gap-4"
    >
      {/* Top thumbnail strip */}
      <ThumbnailStrip />

      {/* Section heading */}
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-fomi-teal">
            {tiles.length > 0 ? "Your generations" : "Start creating"}
          </h2>
          <p className="text-xs text-black/50 mt-0.5">
            {tiles.length > 0
              ? `${tiles.length} ${tiles.length === 1 ? "image" : "images"} · click any tile to preview`
              : "Describe a prompt and hit Generate to see your first image."}
          </p>
        </div>
        {tiles.length > 0 && (
          <span className="text-[10px] uppercase tracking-widest text-black/40">
            Latest session
          </span>
        )}
      </header>

      {/* Grid: 4 columns desktop, 2 columns tablet, 2 columns mobile */}
      {tiles.length === 0 && pendingCount === 0 && !hasError ? (
        <EmptyState />
      ) : hasError && tiles.length === 0 ? (
        <ErrorState onRetry={onRetry} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {pendingCount > 0 &&
            Array.from({ length: pendingCount }).map((_, i) => (
              <ImageSkeleton key={`sk-${i}`} aspect="3:4" />
            ))}
          {tiles.map((tile) => (
            <ImageTile key={tile.id} tile={tile} onClick={() => setLightbox(tile)} />
          ))}
        </div>
      )}

      <Lightbox
        image={lightbox}
        onClose={() => setLightbox(null)}
      />
    </section>
  );
}

function ThumbnailStrip() {
  // Repeat the seed thumbnails a few times to fill the strip nicely.
  const items = [...SEED_THUMBNAILS, ...SEED_THUMBNAILS].slice(0, 12);
  return (
    <div className="relative">
      <h3 className="text-[10px] uppercase tracking-widest text-black/40 mb-2">
        Recently used
      </h3>
      <div className="flex gap-2 overflow-x-auto scrollbar-thin-light pb-2 -mx-1 px-1">
        {items.map((src, i) => (
          <button
            key={i}
            className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-lg overflow-hidden bg-black/5 ring-1 ring-black/5 hover:ring-fomi-coral/40 transition lift-on-hover"
            aria-label={`Use recently used image ${i + 1} as reference`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function ImageTile({
  tile,
  onClick,
}: {
  tile: GeneratedTile;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-black/5 ring-1 ring-black/5 hover:ring-fomi-coral/50 lift-on-hover image-vignette focus-visible:outline-2 focus-visible:outline-fomi-coral"
      aria-label={`Preview image: ${tile.prompt.slice(0, 60)}${tile.prompt.length > 60 ? "…" : ""}`}
    >
      <Image
        src={tile.url}
        alt={tile.prompt}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      {/* Footer caption appears on hover */}
      <div className="absolute inset-x-0 bottom-0 p-2.5 pt-8 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        <p className="text-[11px] text-white/90 line-clamp-2 leading-snug bg-black/40 backdrop-blur-sm rounded-md px-2 py-1">
          {tile.prompt}
        </p>
      </div>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-black/15 bg-white/40 p-10 sm:p-14 text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-fomi-coral-soft text-fomi-coral grid place-items-center mb-4">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3.5 13.8 9 19 10.8 13.8 12.6 12 18 10.2 12.6 5 10.8 10.2 9 12 3.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-fomi-teal mb-1">
        Describe your imagination
      </h3>
      <p className="text-sm text-black/55 max-w-md mx-auto">
        Try a prompt like{" "}
        <span className="font-mono text-fomi-coral">
          "Editorial portrait of auburn-haired woman in cream knit sweater, soft window light"
        </span>{" "}
        — then click Generate.
      </p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-10 sm:p-14 text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-red-100 text-red-500 grid place-items-center mb-4 text-2xl">
        !
      </div>
      <h3 className="text-base font-semibold text-red-700 mb-1">
        Generation failed
      </h3>
      <p className="text-sm text-red-600/80 max-w-md mx-auto mb-4">
        The image model is currently rate-limited. We&apos;ve shown fallback
        images where possible. Try again in a moment.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 h-9 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
        >
          Retry
        </button>
      )}
    </div>
  );
}
