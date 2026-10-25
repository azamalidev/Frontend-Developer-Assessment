"use client";

import * as React from "react";
import { ModeSwitcher, WorkspaceMode } from "@/components/fomi/shared/ModeSwitcher";
import { PartAWorkspace } from "@/components/fomi/partA/PartAWorkspace";
import { PartBWorkspace } from "@/components/fomi/partB/PartBWorkspace";

/**
 * Fomi assessment entry page. Two workspaces, one route:
 * - Part A: faithful recreation of the supplied mockup (light theme)
 * - Part B: original "Composer" image-generation workspace (cinematic dark)
 *
 * A floating mode switcher at top-center toggles between them. Each workspace
 * manages its own header, layout, and scrolling — they never share state.
 */
export default function Home() {
  const [mode, setMode] = React.useState<WorkspaceMode>("mockup");

  return (
    <>
      <ModeSwitcher mode={mode} onChange={setMode} />
      {mode === "mockup" ? <PartAWorkspace /> : <PartBWorkspace />}
    </>
  );
}
