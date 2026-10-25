"use client";

import * as React from "react";
import { TopNav } from "./TopNav";
import { PromptCard } from "./PromptCard";
import { ImageGrid, GeneratedTile } from "./ImageGrid";
import { generateImages, GenerateRequest } from "@/components/fomi/lib/api";

/**
 * Part A — faithful recreation of the Fomi mockup page (light theme).
 * Top nav + left prompt sidebar + responsive image grid. The generate
 * button actually calls the backend route which uses the z-ai image SDK.
 */
export function PartAWorkspace() {
  // Top nav active tab
  const [navId, setNavId] = React.useState("image");

  // Prompt + controls state
  const [prompt, setPrompt] = React.useState("");
  const [count, setCount] = React.useState(4);
  const [modelId, setModelId] = React.useState("fomi-pro");
  const [styleId, setStyleId] = React.useState("editorial");
  const [aspectId, setAspectId] = React.useState("3:4");
  const [seed, setSeed] = React.useState<number | undefined>(undefined);
  const [steps, setSteps] = React.useState(35);
  const [guidance, setGuidance] = React.useState(7.5);

  // Generated tiles
  const [tiles, setTiles] = React.useState<GeneratedTile[]>([]);
  const [pending, setPending] = React.useState(0);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState(false);

  async function handleGenerate() {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(false);
    setPending(count);

    const req: GenerateRequest = {
      prompt: prompt.trim(),
      modelId,
      styleId,
      aspectId,
      count,
      seed,
    };

    try {
      const res = await generateImages(req);
      const newTiles: GeneratedTile[] = res.images.map((img) => ({
        id: img.id,
        url: img.url,
        prompt: img.prompt,
        model: img.modelId,
        style: img.styleId,
        aspect: img.aspectId,
        seed: img.seed,
        createdAt: img.createdAt,
      }));
      // Prepend new tiles to the front of the grid (latest first).
      setTiles((prev) => [...newTiles, ...prev]);
    } catch (err) {
      console.warn("[generate] failed:", err);
      setError(true);
    } finally {
      setPending(0);
      setIsGenerating(false);
    }
  }

  // Seed the grid with the pre-generated portrait set on first mount so
  // the page never feels empty before the user types anything.
  React.useEffect(() => {
    import("@/components/fomi/lib/constants").then(
      ({ SEED_PORTRAITS, THUMBNAIL_PROMPTS }) => {
        const seedTiles: GeneratedTile[] = SEED_PORTRAITS.map((url, i) => ({
          id: `seed-${i}`,
          url,
          prompt: THUMBNAIL_PROMPTS[6 + i] ?? "Editorial portrait",
          model: "fomi-pro",
          style: "editorial",
          aspect: "3:4",
          seed: 1000 + i * 137,
          createdAt: new Date(Date.now() - i * 60_000).toISOString(),
        }));
        setTiles(seedTiles);
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-fomi-beige text-fomi-ink">
      <TopNav activeId={navId} onChange={setNavId} />

      {/* Main content: left sidebar (prompt) + right main (grid) */}
      <main
        className="max-w-[1500px] mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-6"
        role="main"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)] gap-4 sm:gap-6">
          {/* Sidebar */}
          <aside
            className="lg:sticky lg:top-20 self-start"
            aria-label="Prompt controls"
          >
            <PromptCard
              prompt={prompt}
              onPromptChange={setPrompt}
              count={count}
              onCountChange={setCount}
              modelId={modelId}
              onModelChange={setModelId}
              styleId={styleId}
              onStyleChange={setStyleId}
              aspectId={aspectId}
              onAspectChange={setAspectId}
              seed={seed}
              onSeedChange={setSeed}
              steps={steps}
              onStepsChange={setSteps}
              guidance={guidance}
              onGuidanceChange={setGuidance}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />

            {/* Sidebar footer — credits + upgrade hint */}
            <div className="mt-3 p-3 rounded-2xl bg-white/60 border border-black/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-fomi-coral-soft text-fomi-coral grid place-items-center text-[10px] font-bold">
                  PRO
                </div>
                <div className="leading-tight">
                  <div className="font-semibold text-fomi-teal">Pro plan</div>
                  <div className="text-black/50">128 / 500 credits</div>
                </div>
              </div>
              <button className="h-7 px-2.5 rounded-full bg-fomi-coral text-white text-[11px] font-semibold hover:brightness-110 transition">
                Top up
              </button>
            </div>
          </aside>

          {/* Main image grid */}
          <div className="min-w-0">
            <ImageGrid
              tiles={tiles}
              pendingCount={pending}
              hasError={error}
              onRetry={handleGenerate}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
