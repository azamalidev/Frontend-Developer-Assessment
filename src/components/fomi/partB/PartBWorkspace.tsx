"use client";

import * as React from "react";
import { Toolbar } from "./Toolbar";
import { SessionRail } from "./SessionRail";
import { CinematicCanvas } from "./CinematicCanvas";
import { FloatingPromptBar } from "./FloatingPromptBar";
import { ShotFilmstrip } from "./ShotFilmstrip";
import { InspectorDock } from "./InspectorDock";
import { Lightbox } from "@/components/fomi/shared/Lightbox";
import { generateImages, GenerateRequest } from "@/components/fomi/lib/api";
import { MOCK_PROJECTS, MOCK_SHOTS, Shot } from "@/components/fomi/lib/mock-data";

/**
 * Part B — original image-generation workspace redesign.
 *
 * Concept: "Fomi Composer" — treat each generation as a "shot" in a film
 * sequence. Center stage is a cinematic letterbox frame; bottom is a
 * shot-list filmstrip; right is an inspector dock with extracted palette.
 *
 * Unique design decisions:
 * - Canvas is the hero (not the sidebar). The prompt bar floats over it.
 * - Ingredient chips (model/style/aspect) cycle on click — no dropdown hell.
 * - Inspector shows extracted color palette — copyable with a click.
 * - Filmstrip at bottom mimics a film editor's clip tray.
 */
export function PartBWorkspace() {
  const [activeProjectId, setActiveProjectId] = React.useState("p1");
  const activeProject = MOCK_PROJECTS.find((p) => p.id === activeProjectId)!;

  const [railCollapsed, setRailCollapsed] = React.useState(false);
  const [dockCollapsed, setDockCollapsed] = React.useState(false);

  // Prompt bar state
  const [prompt, setPrompt] = React.useState("");
  const [modelId, setModelId] = React.useState("fomi-pro");
  const [styleId, setStyleId] = React.useState("editorial");
  const [aspectId, setAspectId] = React.useState("3:4");

  // Shots: start with the seed mock data so the workspace feels alive on first load.
  const [shots, setShots] = React.useState<Shot[]>(MOCK_SHOTS);
  const [activeShotId, setActiveShotId] = React.useState<string | null>(
    MOCK_SHOTS[0]?.id ?? null
  );
  const [pending, setPending] = React.useState(0);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [lightbox, setLightbox] = React.useState<
    | (Shot & { url: string; prompt: string; model?: string; style?: string })
    | null
  >(null);

  const activeShot = shots.find((s) => s.id === activeShotId) ?? null;

  async function handleGenerate() {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setPending(4);

    const req: GenerateRequest = {
      prompt: prompt.trim(),
      modelId,
      styleId,
      aspectId,
      count: 4,
    };

    try {
      const res = await generateImages(req);
      const newShots: Shot[] = res.images.map((img, idx) => ({
        id: img.id,
        prompt: img.prompt,
        modelId: img.modelId,
        styleId: img.styleId,
        aspectId: img.aspectId,
        seed: img.seed,
        status: "complete",
        createdAt: img.createdAt,
        imageUrl: img.url,
        palette: ["#1e3a4c", "#ff6b4a", "#f4e9d9", "#8a6a4a", "#d4ff3a"].slice(
          0,
          3 + (idx % 3)
        ),
        starred: false,
        remixCount: 0,
      }));
      // Prepend new shots to the filmstrip
      setShots((prev) => [...newShots, ...prev]);
      // Activate the first new shot
      if (newShots[0]) setActiveShotId(newShots[0].id);
      // Clear the prompt — encourages the next "shot" to be its own creative move
      setPrompt("");
    } catch (err) {
      console.warn("[generate] failed:", err);
    } finally {
      setPending(0);
      setIsGenerating(false);
    }
  }

  function handleRemix(shot: Shot) {
    // Remix = prefill the prompt bar with the source shot's prompt
    setPrompt(shot.prompt);
    setModelId(shot.modelId);
    setStyleId(shot.styleId);
    setAspectId(shot.aspectId);
  }

  function handleStar(shot: Shot) {
    setShots((prev) =>
      prev.map((s) =>
        s.id === shot.id ? { ...s, starred: !s.starred } : s
      )
    );
    // Lightbox view of the active shot:
    if (activeShot) {
      setLightbox({
        ...activeShot,
        url: activeShot.imageUrl,
      });
    }
  }

  function handleShare(shot: Shot) {
    if (navigator.share) {
      navigator
        .share({
          title: "Fomi shot",
          text: shot.prompt,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  }

  function handleDownload(shot: Shot) {
    const a = document.createElement("a");
    a.href = shot.imageUrl;
    a.download = shot.imageUrl.split("/").pop() ?? "fomi-shot.png";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  }

  return (
    <div className="h-screen w-full flex flex-col bg-canvas-dark text-white overflow-hidden">
      <Toolbar
        projectName={activeProject.name}
        shotCount={activeProject.shotCount + shots.length - MOCK_SHOTS.length}
        onShare={() => activeShot && handleShare(activeShot)}
      />

      {/* Body: rail · canvas · dock */}
      <div className="flex-1 flex min-h-0">
        <SessionRail
          collapsed={railCollapsed}
          onToggleCollapsed={() => setRailCollapsed((c) => !c)}
          activeProjectId={activeProjectId}
          onProjectChange={setActiveProjectId}
        />

        {/* Canvas + prompt bar + filmstrip stacked */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="relative flex-1 min-h-0">
            <CinematicCanvas
              shot={activeShot}
              onRemix={handleRemix}
              onStar={handleStar}
              onShare={handleShare}
              onDownload={handleDownload}
            />
            <FloatingPromptBar
              prompt={prompt}
              onPromptChange={setPrompt}
              modelId={modelId}
              onModelChange={setModelId}
              styleId={styleId}
              onStyleChange={setStyleId}
              aspectId={aspectId}
              onAspectChange={setAspectId}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>

          <ShotFilmstrip
            shots={shots}
            activeShotId={activeShotId}
            onShotSelect={(shot) => setActiveShotId(shot.id)}
            pendingCount={pending}
          />
        </div>

        <InspectorDock
          shot={activeShot}
          onRemix={handleRemix}
          collapsed={dockCollapsed}
          onToggleCollapsed={() => setDockCollapsed((c) => !c)}
        />
      </div>

      <Lightbox
        image={lightbox}
        onClose={() => setLightbox(null)}
        onStar={() => activeShot && handleStar(activeShot)}
        starred={activeShot?.starred}
        onRemix={(img) => {
          const sourceShot = shots.find((s) => s.imageUrl === img.url);
          if (sourceShot) handleRemix(sourceShot);
          setLightbox(null);
        }}
      />
    </div>
  );
}
