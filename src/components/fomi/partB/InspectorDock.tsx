"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  LayersIcon,
  PaletteIcon,
  RefreshIcon,
  SparkleIcon,
} from "@/components/fomi/icons/FomiIcons";
import { Shot } from "@/components/fomi/lib/mock-data";
import { MODELS, STYLE_PRESETS, getAspect, getModel, getStyle } from "@/components/fomi/lib/constants";

/**
 * InspectorDock — the right column of the workspace.
 * Shows metadata for the currently selected shot: prompt, model, style,
 * aspect, seed, variations, and an extracted color palette.
 *
 * The dock is intentionally compact: professional users scan, they don't read.
 */
export function InspectorDock({
  shot,
  onRemix,
  collapsed,
  onToggleCollapsed,
}: {
  shot: Shot | null;
  onRemix: (shot: Shot) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  if (collapsed) {
    return (
      <aside
        className="hidden xl:flex w-[56px] shrink-0 flex-col items-center bg-canvas-darker border-l border-white/5 py-3 gap-2"
        aria-label="Inspector (collapsed)"
      >
        <button
          onClick={onToggleCollapsed}
          aria-label="Expand inspector"
          className="h-9 w-9 grid place-items-center rounded-lg text-white/85 hover:bg-white/5"
        >
          <ChevronRightIcon size={14} />
        </button>
        <div className="h-9 w-9 grid place-items-center text-white/50">
          <PaletteIcon size={14} />
        </div>
        <div className="h-9 w-9 grid place-items-center text-white/50">
          <LayersIcon size={14} />
        </div>
        <div className="h-9 w-9 grid place-items-center text-white/50">
          <ClockIcon size={14} />
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="hidden xl:flex w-[320px] shrink-0 flex-col bg-canvas-darker border-l border-white/5"
      aria-label="Shot inspector"
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-white/5">
        <h2 className="text-sm font-semibold text-white/90">
          Inspector
        </h2>
        <button
          onClick={onToggleCollapsed}
          aria-label="Collapse inspector"
          className="h-7 w-7 grid place-items-center rounded-md text-white/55 hover:bg-white/5"
        >
          <ChevronRightIcon size={14} className="rotate-180" />
        </button>
      </div>

      {/* Body */}
      {shot ? (
        <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-4">
          {/* Shot id + status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/85 text-xs font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-fomi-lime animate-pulse" />
              {shot.id.toUpperCase()}
            </div>
            <span className="text-[10px] uppercase tracking-widest text-white/45">
              {shot.status}
            </span>
          </div>

          {/* Prompt */}
          <div>
            <SectionLabel>Prompt</SectionLabel>
            <p className="mt-1 text-sm text-white/85 leading-relaxed">
              {shot.prompt}
            </p>
          </div>

          {/* Parameters */}
          <div>
            <SectionLabel>Parameters</SectionLabel>
            <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              <ParamRow label="Model" value={getModel(shot.modelId).name} />
              <ParamRow
                label="Style"
                value={getStyle(shot.styleId).name}
                swatch={getStyle(shot.styleId).swatch}
              />
              <ParamRow label="Aspect" value={getAspect(shot.aspectId).label} />
              <ParamRow label="Seed" value={String(shot.seed)} mono />
              <ParamRow
                label="Created"
                value={new Date(shot.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
              <ParamRow
                label="Remixes"
                value={String(shot.remixCount ?? 0)}
                accent
              />
            </dl>
          </div>

          {/* Color palette */}
          {shot.palette && shot.palette.length > 0 && (
            <div>
              <SectionLabel>Extracted palette</SectionLabel>
              <div className="mt-2 grid grid-cols-5 gap-1.5">
                {shot.palette.map((c, i) => (
                  <button
                    key={i}
                    title={c}
                    onClick={() => navigator.clipboard?.writeText(c)}
                    className="aspect-square rounded-md ring-1 ring-white/10 hover:ring-white/40 transition"
                    style={{ background: c }}
                    aria-label={`Copy color ${c}`}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-[10px] text-white/35">
                Click swatch to copy hex
              </p>
            </div>
          )}

          {/* Variations */}
          {shot.variations && shot.variations.length > 0 && (
            <div>
              <SectionLabel>
                Variations ({shot.variations.length})
              </SectionLabel>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {shot.variations.map((v) => (
                  <button
                    key={v.id}
                    className="aspect-[3/4] rounded-md overflow-hidden ring-1 ring-white/10 hover:ring-white/40 transition"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => onRemix(shot)}
              className="h-9 w-full inline-flex items-center justify-center gap-2 rounded-full bg-fomi-lime text-canvas-dark text-sm font-semibold hover:brightness-110 transition"
            >
              <RefreshIcon size={14} />
              Remix shot
            </button>
            <button className="h-9 w-full inline-flex items-center justify-center gap-2 rounded-full bg-white/5 text-white/85 text-sm hover:bg-white/10 transition">
              <SparkleIcon size={14} />
              Create variation
            </button>
          </div>
        </div>
      ) : (
        <EmptyInspector />
      )}
    </aside>
  );
}

function EmptyInspector() {
  return (
    <div className="flex-1 grid place-items-center p-6 text-center">
      <div className="flex flex-col items-center gap-2 text-white/40 text-sm">
        <div className="h-10 w-10 rounded-xl bg-white/5 ring-1 ring-white/10 grid place-items-center">
          <LayersIcon size={18} />
        </div>
        <span>Select a shot to inspect</span>
        <span className="text-[11px] text-white/30">
          Click any tile in the filmstrip to see its parameters, palette, and variations.
        </span>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-widest text-white/40">
      {children}
    </div>
  );
}

function ParamRow({
  label,
  value,
  mono,
  swatch,
  accent,
}: {
  label: string;
  value: string;
  mono?: boolean;
  swatch?: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[10px] uppercase tracking-widest text-white/40">
        {label}
      </dt>
      <dd
        className={`flex items-center gap-1.5 text-white/85 ${
          mono ? "font-mono" : ""
        } ${accent ? "text-fomi-lime" : ""}`}
      >
        {swatch && (
          <span
            className="h-2.5 w-2.5 rounded-full ring-1 ring-white/15"
            style={{ background: swatch }}
          />
        )}
        {value}
      </dd>
    </div>
  );
}
