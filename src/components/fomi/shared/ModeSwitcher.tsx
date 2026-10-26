"use client";

import * as React from "react";

export type WorkspaceMode = "mockup" | "composer";

/**
 * ModeSwitcher — top-of-page tab that toggles between
 * Part A (mockup recreation) and Part B (original composer workspace).
 *
 * Floating pill, fixed top-center so it doesn't fight with the workspaces'
 * own headers. Keyboard accessible.
 */
export function ModeSwitcher({
  mode,
  onChange,
}: {
  mode: WorkspaceMode;
  onChange: (mode: WorkspaceMode) => void;
}) {
  return (
    <div
      className="fixed top-3 right-3 z-[100] flex items-center gap-0.5 p-1 rounded-full bg-black/85 backdrop-blur-md ring-1 ring-white/15 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5)]"
      role="tablist"
      aria-label="Workspace mode"
    >
      <ModeTab
        active={mode === "mockup"}
        onClick={() => onChange("mockup")}
        label="Part A · Mockup"
      />
      <ModeTab
        active={mode === "composer"}
        onClick={() => onChange("composer")}
        label="Part B · Composer"
      />
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`h-7 px-3 rounded-full text-[11px] sm:text-xs font-medium transition-colors
        ${
          active
            ? "bg-white text-black"
            : "text-white/65 hover:text-white"
        }
      `}
    >
      {label}
    </button>
  );
}
