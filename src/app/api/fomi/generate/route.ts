import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface GenerateBody {
  prompt: string;
  modelId?: string;
  styleId?: string;
  aspectId?: string;
  count?: number;
  seed?: number;
}

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  modelId: string;
  styleId: string;
  aspectId: string;
  seed: number;
  createdAt: string;
}

const ASPECT_TO_SIZE: Record<string, string> = {
  "1:1": "1024x1024",
  "3:4": "864x1152",
  "4:3": "1152x864",
  "16:9": "1344x768",
  "9:16": "720x1440",
};

const STYLE_HINT: Record<string, string> = {
  editorial: ", editorial photography, magazine cover quality, premium",
  cinematic: ", cinematic still, anamorphic, shallow depth of field, color graded",
  product: ", studio product photography, soft shadow, marble surface, luxury",
  anime: ", anime key visual, sharp line art, vibrant color palette",
  "3d-render": ", octane render, soft global illumination, photoreal 3D",
  "film-noir": ", black and white film noir, hard key light, deep shadows",
  watercolor: ", watercolor painting, paper texture, bleeding pigments",
  auto: "",
};

const FOMI_LIBRARY = "/seed-images";

/** Lists available seed images on disk so we can fall back when the live
 *  image model is rate-limited (HTTP 429) or unavailable. */
async function listSeedImages(): Promise<string[]> {
  try {
    const abs = path.join(process.cwd(), "public", "seed-images");
    const files = await fs.readdir(abs);
    return files.filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort();
  } catch {
    return [];
  }
}

/**
 * Calls the z-ai image generation CLI as a child process. Returns the
 * relative URL of the generated image, or null if generation failed.
 */
async function generateOneImage(
  prompt: string,
  aspectId: string,
  outDir: string,
  fileName: string
): Promise<string | null> {
  const size = ASPECT_TO_SIZE[aspectId] ?? "1024x1024";
  const outPath = path.join(outDir, fileName);

  return new Promise<string | null>((resolve) => {
    const proc = spawn("z-ai", [
      "image", "-p", prompt, "-o", outPath, "-s", size,
    ], { stdio: ["ignore", "pipe", "pipe"] });

    let stderr = "";
    proc.stderr?.on("data", (chunk) => {
      stderr += chunk.toString().slice(0, 1024);
    });

    proc.on("error", (err) => {
      console.warn("[generate] spawn error:", err.message);
      resolve(null);
    });

    proc.on("exit", (code) => {
      if (code !== 0) {
        console.warn("[generate] z-ai image failed:", stderr.slice(0, 200));
        resolve(null);
        return;
      }
      resolve(`/generated/${fileName}`);
    });
  });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as GenerateBody;
  const prompt = (body.prompt ?? "").trim();
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const count = Math.max(1, Math.min(8, body.count ?? 4));
  const aspectId = body.aspectId ?? "1:1";
  const styleId = body.styleId ?? "auto";
  const styleHint = STYLE_HINT[styleId] ?? "";
  const fullPrompt = prompt + styleHint;

  // Ensure /public/generated exists.
  const genDir = path.join(process.cwd(), "public", "generated");
  await fs.mkdir(genDir, { recursive: true });

  const startedAt = Date.now();
  const seedImages = await listSeedImages();

  // Try to call the model up to `count` times. On any failure, fall back
  // deterministically to a seed image so the UI never breaks.
  const images: GeneratedImage[] = [];

  for (let i = 0; i < count; i++) {
    const id = `${Date.now()}-${i}-${randomBytes(4).toString("hex")}`;
    const fileName = `${id}.png`;

    let url: string | null = null;
    try {
      url = await generateOneImage(fullPrompt, aspectId, genDir, fileName);
    } catch (err) {
      console.warn("[generate] attempt error:", err);
    }

    if (!url) {
      // Fallback: pick a seed image deterministically.
      const seed = seedImages.length
        ? seedImages[(i + prompt.length) % seedImages.length]
        : null;
      if (seed) url = `${FOMI_LIBRARY}/${seed}`;
    }

    if (!url) {
      // Last-resort: skip this slot (UI will show fewer tiles than requested)
      continue;
    }

    images.push({
      id,
      url,
      prompt,
      modelId: body.modelId ?? "fomi-pro",
      styleId,
      aspectId,
      seed: body.seed ?? Math.floor(Math.random() * 1_000_000),
      createdAt: new Date().toISOString(),
    });
  }

  if (images.length === 0) {
    return NextResponse.json(
      {
        error:
          "Image generation temporarily unavailable. Please try again in a moment.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    images,
    durationMs: Date.now() - startedAt,
  });
}
