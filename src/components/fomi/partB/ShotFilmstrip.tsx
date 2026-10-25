"use client";

import * as React from "react";
import Image from "next/image";
import { StarIcon } from "@/components/fomi/icons/FomiIcons";
import { Shot } from "@/components/fomi/lib/mock-data";

/**
 * ShotFilmstrip — horizontal scrolling "shot list" at the bottom.
 * Each thumbnail represents one past generation in this session.
 * Active shot is highlighted with a lime ring.
 */
export function ShotFilmstrip({
  shots,
  activeShotId,
  onShotSelect,
  pendingCount,
}: {
  shots: Shot[];
  activeShotId: string | null;
  onShotSelect: (shot: Shot) => void;
  pendingCount: number;
}) {
  return (
    <footer
      className="relative z-20 bg-canvas-darker border-t border-white/5 filmstrip-ticks"
      aria-label="Shot filmstrip"
    >
      <div className="flex items-center justify-between px-4 h-9 border-b border-white/5 text-white/55 text-[10px] uppercase tracking-widest">
        <span>Shot list · {shots.length} generations</span>
        <span className="hidden md:inline">
          ← → to navigate · ⌘+Backspace to delete
        </span>
      </div>

      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-thin">
        {/* Loading skeletons */}
        {pendingCount > 0 &&
          Array.from({ length: pendingCount }).map((_, i) => (
            <div
              key={`pending-${i}`}
              className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-lg overflow-hidden bg-white/5 ring-1 ring-white/10"
              aria-hidden
            >
              <div className="absolute inset-0 shimmer-dark" />
            </div>
          ))}

        {shots.length === 0 && pendingCount === 0 ? (
          <div className="text-white/35 text-xs py-2 px-1">
            No shots in this session yet. Type a prompt and hit Generate.
          </div>
        ) : (
          shots.map((shot) => (
            <ShotThumb
              key={shot.id}
              shot={shot}
              active={shot.id === activeShotId}
              onClick={() => onShotSelect(shot)}
            />
          ))
        )}
      </div>
    </footer>
  );
}

function ShotThumb({
  shot,
  active,
  onClick,
}: {
  shot: Shot;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={`Open shot ${shot.id}: ${shot.prompt.slice(0, 60)}`}
      className={`group relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-lg overflow-hidden ring-1 transition-all
        ${
          active
            ? "ring-2 ring-fomi-lime"
            : "ring-white/10 hover:ring-white/40"
        }
      `}
    >
      <Image
        src={shot.imageUrl}
        alt=""
        fill
        sizes="64px"
        className="object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
      {/* Star indicator */}
      {shot.starred && (
        <span className="absolute top-0.5 right-0.5 text-fomi-amber">
          <StarIcon size={10} />
        </span>
      )}
      {/* Hover label */}
      <span className="absolute inset-x-0 bottom-0 px-1 py-0.5 text-[9px] text-white/80 bg-black/60 backdrop-blur-sm truncate opacity-0 group-hover:opacity-100 transition-opacity">
        {shot.id}
      </span>
    </button>
  );
}
