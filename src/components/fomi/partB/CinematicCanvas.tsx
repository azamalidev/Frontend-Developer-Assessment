"use client";

import * as React from "react";
import Image from "next/image";
import {
  ChevronRightIcon,
  DownloadIcon,
  HeartIcon,
  MoreIcon,
  ShareIcon,
  StarIcon,
  WandIcon,
} from "@/components/fomi/icons/FomiIcons";
import { Shot } from "@/components/fomi/lib/mock-data";
import { getAspect } from "@/components/fomi/lib/constants";

/**
 * Cinematic canvas — the centerpiece of the Part B workspace.
 * Treats the current shot as if it were a film frame: letterboxed,
 * with floating action chips on the right and an "ingredients" overlay
 * showing the prompt's lineage (parents, references).
 */
export function CinematicCanvas({
  shot,
  onRemix,
  onStar,
  onShare,
  onDownload,
}: {
  shot: Shot | null;
  onRemix: (shot: Shot) => void;
  onStar: (shot: Shot) => void;
  onShare: (shot: Shot) => void;
  onDownload: (shot: Shot) => void;
}) {
  const aspect = shot ? getAspect(shot.aspectId) : getAspect("3:4");
  const aspectClass = `${aspect.w} / ${aspect.h}`;

  return (
    <section
      className="relative flex-1 min-w-0 grid place-items-center bg-canvas-darker overflow-hidden canvas-grain"
      aria-label="Cinematic preview"
    >
      {/* Ambient backdrop: subtle blurred echo of the active shot */}
      {shot && (
        <div
          className="absolute inset-0 opacity-30 blur-3xl scale-110"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shot.imageUrl}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      )}

      {/* Vignette frame */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* The frame */}
      <div className="relative z-10 px-6 py-8 sm:py-10 w-full max-w-[900px]">
        <div
          className="relative mx-auto rounded-xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
          style={{ aspectRatio: aspectClass }}
        >
          {shot ? (
            <Image
              src={shot.imageUrl}
              alt={shot.prompt}
              fill
              sizes="(min-width: 1024px) 60vw, 90vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-white/40 text-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-full ring-1 ring-white/15 grid place-items-center">
                  <WandIcon size={18} />
                </div>
                <span>No shot selected</span>
              </div>
            </div>
          )}

          {/* Letterbox bars — cinematic touch */}
          <div className="absolute inset-x-0 top-0 h-[5%] bg-black/60 pointer-events-none" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 h-[5%] bg-black/60 pointer-events-none" aria-hidden />

          {/* Top-left: shot chip */}
          {shot && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-black/55 backdrop-blur text-white/85 text-[11px] font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-fomi-lime animate-pulse" />
              <span>{shot.id.toUpperCase()}</span>
              {shot.starred && (
                <span className="ml-1 text-fomi-amber">
                  <StarIcon size={11} />
                </span>
              )}
            </div>
          )}

          {/* Top-right: action chips */}
          {shot && (
            <div className="absolute top-3 right-3 flex items-center gap-1">
              <CanvasChipButton
                label="Star"
                icon={<HeartIcon size={14} />}
                active={shot.starred}
                onClick={() => onStar(shot)}
              />
              <CanvasChipButton
                label="Share"
                icon={<ShareIcon size={14} />}
                onClick={() => onShare(shot)}
              />
              <CanvasChipButton
                label="Download"
                icon={<DownloadIcon size={14} />}
                onClick={() => onDownload(shot)}
              />
              <CanvasChipButton
                label="More"
                icon={<MoreIcon size={14} />}
                onClick={() => {}}
              />
            </div>
          )}

          {/* Bottom-left: prompt lineage */}
          {shot && (
            <div className="absolute bottom-3 left-3 max-w-[60%]">
              <div className="px-2.5 py-1.5 rounded-lg bg-black/55 backdrop-blur text-white/85 text-[11px] leading-relaxed">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/50 mb-0.5">
                  <span>Prompt lineage</span>
                  {shot.remixCount ? (
                    <span className="text-fomi-lime">
                      · {shot.remixCount} remix{shot.remixCount === 1 ? "" : "es"}
                    </span>
                  ) : null}
                </div>
                <p className="line-clamp-2">{shot.prompt}</p>
              </div>
            </div>
          )}

          {/* Bottom-right: remix CTA */}
          {shot && (
            <button
              onClick={() => onRemix(shot)}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-fomi-lime text-canvas-dark text-[11px] font-semibold hover:brightness-110 transition"
            >
              <WandIcon size={12} />
              <span>Remix this shot</span>
              <ChevronRightIcon size={12} />
            </button>
          )}
        </div>

        {/* Sub-caption row beneath the frame */}
        {shot && (
          <div className="mt-3 flex items-center justify-between text-white/55 text-[11px] font-mono">
            <div className="flex items-center gap-3">
              <span>{shot.aspectId}</span>
              <span className="text-white/20">·</span>
              <span>{shot.modelId}</span>
              <span className="text-white/20">·</span>
              <span>{shot.styleId}</span>
              <span className="text-white/20">·</span>
              <span>seed {shot.seed}</span>
            </div>
            <div>{new Date(shot.createdAt).toLocaleString()}</div>
          </div>
        )}
      </div>
    </section>
  );
}

function CanvasChipButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`h-7 w-7 grid place-items-center rounded-full transition-colors ${
        active
          ? "bg-fomi-amber text-canvas-dark"
          : "bg-black/55 text-white/85 backdrop-blur hover:bg-black/75"
      }`}
    >
      {icon}
    </button>
  );
}
