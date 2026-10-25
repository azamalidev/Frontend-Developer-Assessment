/**
 * Client-side API helpers — typed wrappers around the Fomi API routes.
 * All functions are safe to call from React components.
 */

export interface GenerateRequest {
  prompt: string;
  modelId: string;
  styleId: string;
  aspectId: string;
  count: number;
  seed?: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  modelId: string;
  styleId: string;
  aspectId: string;
  seed: number;
  createdAt: string;
}

export interface GenerateResponse {
  images: GeneratedImage[];
  durationMs: number;
}

/** POST /api/fomi/generate — produces N images for the given prompt. */
export async function generateImages(
  req: GenerateRequest,
  signal?: AbortSignal
): Promise<GenerateResponse> {
  const res = await fetch("/api/fomi/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
    signal,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Generate failed (${res.status}): ${body}`);
  }
  return res.json();
}

/** GET /api/fomi/templates — returns curated prompt+style preset templates. */
export async function fetchTemplates(signal?: AbortSignal) {
  const res = await fetch("/api/fomi/templates", { signal });
  if (!res.ok) throw new Error(`Templates failed (${res.status})`);
  return res.json() as Promise<{ templates: TemplatePreset[] }>;
}

export interface TemplatePreset {
  id: string;
  title: string;
  prompt: string;
  preview: string;
  tags: string[];
  modelId: string;
  styleId: string;
}
