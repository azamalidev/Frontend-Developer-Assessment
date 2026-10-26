"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  PlusIcon,
  SparkleIcon,
  SpinnerIcon,
} from "@/components/fomi/icons/FomiIcons";
import {
  ASPECT_RATIOS,
  MODELS,
  STYLE_PRESETS,
} from "@/components/fomi/lib/constants";

/**
 * FloatingPromptBar — the bottom-center glassmorphism prompt bar.
 * Compact, ingredient-chip driven, with a circular Generate button on the right.
 *
 * The bar is intentionally narrower than the canvas so it visually floats;
 * on small screens it drops the chips and grows full-width.
 */
export function FloatingPromptBar({
  prompt,
  onPromptChange,
  modelId,
  onModelChange,
  styleId,
  onStyleChange,
  aspectId,
  onAspectChange,
  onGenerate,
  isGenerating,
  onAttachReference,
}: {
  prompt: string;
  onPromptChange: (v: string) => void;
  modelId: string;
  onModelChange: (id: string) => void;
  styleId: string;
  onStyleChange: (id: string) => void;
  aspectId: string;
  onAspectChange: (id: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onAttachReference?: () => void;
}) {
  return (
    <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 w-[min(940px,calc(100%-2rem))] z-30">
      <div className="pointer-events-auto glass-panel rounded-2xl px-2 py-2 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
        <div className="flex items-end gap-2">
          {/* Reference attach button */}
          <button
            onClick={onAttachReference}
            aria-label="Attach reference image"
            title="Attach reference"
            className="h-11 w-11 shrink-0 grid place-items-center rounded-xl bg-white/5 hover:bg-white/10 text-white/85 transition"
          >
            <PlusIcon size={16} />
          </button>

          {/* Prompt input + ingredient chips */}
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <input
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder="Describe the shot you imagine..."
              className="w-full bg-transparent text-white placeholder:text-white/40 text-sm focus:outline-none px-1 py-1.5"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (prompt.trim() && !isGenerating) onGenerate();
                }
              }}
            />

            {/* Ingredient chips */}
            <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
              <IngredientChip
                label={MODELS.find((m) => m.id === modelId)?.name ?? "Model"}
                onClick={() => cycleValue(MODELS, modelId, onModelChange)}
              />
              <IngredientChip
                label={
                  STYLE_PRESETS.find((s) => s.id === styleId)?.name ?? "Style"
                }
                swatch={STYLE_PRESETS.find((s) => s.id === styleId)?.swatch}
                onClick={() =>
                  cycleValue(STYLE_PRESETS, styleId, onStyleChange)
                }
              />
              <IngredientChip
                label={
                  ASPECT_RATIOS.find((a) => a.id === aspectId)?.label ?? "Aspect"
                }
                onClick={() =>
                  cycleValue(ASPECT_RATIOS, aspectId, onAspectChange)
                }
              />
              <span className="text-[10px] text-white/30 ml-auto hidden lg:inline">
                Press Enter to generate
              </span>
            </div>
          </div>

          {/* Generate button — circular, lime accent */}
          <button
            onClick={onGenerate}
            disabled={!prompt.trim() || isGenerating}
            aria-busy={isGenerating}
            className={`h-11 w-11 shrink-0 grid place-items-center rounded-full transition-all
              ${
                !prompt.trim() || isGenerating
                  ? "bg-white/10 text-white/40 cursor-not-allowed"
                  : "bg-fomi-lime text-canvas-dark hover:brightness-110 active:scale-95 shadow-[0_0_24px_-2px_rgba(212,255,58,0.7)]"
              }
            `}
            aria-label="Generate"
          >
            {isGenerating ? (
              <SpinnerIcon size={16} />
            ) : (
              <SparkleIcon size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Helper line below the bar */}
      <div className="mt-1.5 text-center text-[10px] text-white/35 font-mono">
        <span className="hidden sm:inline">
          Cycle chips by clicking · Hold Shift + Enter for new line
        </span>
      </div>
    </div>
  );
}

function IngredientChip({
  label,
  swatch,
  onClick,
}: {
  label: string;
  swatch?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full bg-white/5 hover:bg-white/10 text-white/85 text-[11px] transition-colors"
    >
      {swatch && (
        <span
          className="h-2 w-2 rounded-full ring-1 ring-white/20"
          style={{ background: swatch }}
        />
      )}
      <span>{label}</span>
      <ChevronDownIcon size={10} className="text-white/40" />
    </button>
  );
}

/** Cycle to the next value in a list — clicking a chip rotates forward. */
function cycleValue<T extends { id: string }>(
  list: readonly T[],
  currentId: string,
  onChange: (id: string) => void
) {
  const idx = list.findIndex((v) => v.id === currentId);
  const next = list[(idx + 1) % list.length];
  onChange(next.id);
}
