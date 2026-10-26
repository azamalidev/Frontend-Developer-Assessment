"use client";

/** Skeleton placeholder shown while an image is being generated. */
export function ImageSkeleton({
  aspect = "3:4",
}: {
  aspect?: "3:4" | "1:1" | "16:9" | "9:16" | "4:3";
}) {
  const aspectClass: Record<string, string> = {
    "3:4": "aspect-[3/4]",
    "1:1": "aspect-square",
    "16:9": "aspect-video",
    "9:16": "aspect-[9/16]",
    "4:3": "aspect-[4/3]",
  };

  return (
    <div
      className={`relative ${aspectClass[aspect] ?? "aspect-[3/4]"} rounded-xl overflow-hidden bg-black/[0.04] ring-1 ring-black/5`}
      aria-hidden
    >
      <div className="absolute inset-0 shimmer" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center gap-1.5 text-black/40">
          <div className="h-7 w-7 rounded-full border-2 border-black/15 border-t-fomi-coral animate-spin" />
          <span className="text-[10px] uppercase tracking-widest">
            Rendering
          </span>
        </div>
      </div>
    </div>
  );
}
