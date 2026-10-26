/**
 * Fomi platform constants — shared by Part A (mockup) and Part B (workspace).
 * Brand colors, model catalog, aspect ratios, style presets.
 */

export const FOMI_BRAND = {
  name: "Fomi",
  tagline: "Turn imagination into professional-quality images and videos.",
  domain: "Fomi.art",
} as const;

/** Catalog of AI models offered on the platform. */
export const MODELS = [
  { id: "fomi-pro", name: "Fomi Pro",  description: "Photorealistic flagship. Best for portraits, product, editorial." },
  { id: "fomi-vivid", name: "Fomi Vivid", description: "Punchy colors, stylized scenes, marketing creative." },
  { id: "fomi-anime", name: "Fomi Anime", description: "Anime / illustration / character art." },
  { id: "fomi-arch", name: "Fomi Arch", description: "Architecture & interior design visualisation." },
  { id: "fomi-flux", name: "Fomi Flux", description: "Open-weights LoRA-ready generalist." },
] as const;

/** Aspect ratio presets surfaced in the prompt bar. */
export const ASPECT_RATIOS = [
  { id: "1:1", label: "1:1", w: 1024, h: 1024, hint: "Square / social" },
  { id: "3:4", label: "3:4", w: 864, h: 1152, hint: "Portrait" },
  { id: "4:3", label: "4:3", w: 1152, h: 864, hint: "Landscape" },
  { id: "16:9", label: "16:9", w: 1344, h: 768, hint: "Cinematic" },
  { id: "9:16", label: "9:16", w: 720, h: 1440, hint: "Story / vertical" },
] as const;

/** Image-count stepper values for the "4 Images" dropdown. */
export const IMAGE_COUNTS = [1, 2, 4, 6, 8] as const;

/**
 * Style presets. The mockup shows an accordion called "Styles" so we
 * surface a small but tasteful catalog — not a flood of presets.
 */
export const STYLE_PRESETS = [
  { id: "auto", name: "Auto", swatch: "#9ca3af" },
  { id: "editorial", name: "Editorial", swatch: "#d4a574" },
  { id: "cinematic", name: "Cinematic", swatch: "#0f172a" },
  { id: "product", name: "Product", swatch: "#f1f1ee" },
  { id: "anime", name: "Anime", swatch: "#ff6b9d" },
  { id: "3d-render", name: "3D Render", swatch: "#8b5cf6" },
  { id: "film-noir", name: "Film Noir", swatch: "#1c1c1c" },
  { id: "watercolor", name: "Watercolor", swatch: "#7dd3fc" },
] as const;

/** "Advance" accordion exposes fine-grained controls. */
export const ADVANCED_FIELDS = [
  { id: "steps", name: "Steps", min: 10, max: 80, default: 35, step: 1, unit: "" },
  { id: "guidance", name: "Guidance", min: 1, max: 20, default: 7.5, step: 0.1, unit: "" },
  { id: "seed", name: "Seed", placeholder: "Random" },
] as const;

/** Curated thumbnail strip shown above the main image grid in Part A. */
export const THUMBNAIL_PROMPTS = [
  "Surreal staircases in blue sky",
  "Liquid chrome abstract",
  "Cyberpunk street at night",
  "Mountain cabin at golden hour",
  "Tropical flower macro",
  "Perfume bottle on marble",
  "Editorial portrait — auburn hair",
  "Three-quarter portrait — beige cardigan",
  "Side profile — ivory sweater",
  "Half-body portrait — cream turtleneck",
  "Candid editorial — natural light",
  "Three-quarter view — off-white cardigan",
  "Studio portrait — warm tones",
  "Premium editorial — window light",
] as const;

/** Seed image filenames (pre-generated under /seed-images) for the initial render. */
export const SEED_PORTRAITS = [
  "/seed-images/woman-1.png",
  "/seed-images/woman-2.png",
  "/seed-images/woman-3.png",
  "/seed-images/woman-4.png",
  "/seed-images/woman-5.png",
  "/seed-images/woman-6.png",
  "/seed-images/woman-7.png",
  "/seed-images/woman-8.png",
] as const;

export const SEED_THUMBNAILS = [
  "/seed-images/thumb-1.png",
  "/seed-images/thumb-2.png",
  "/seed-images/thumb-3.png",
  "/seed-images/thumb-4.png",
  "/seed-images/thumb-5.png",
] as const;

/** Default prompt shown in the textarea placeholder — matches the mockup wording. */
export const DEFAULT_PROMPT_PLACEHOLDER =
  "Describe your imagination to be converted to piece of art...";

/** Helper: pick an aspect ratio object by id. */
export function getAspect(id: string) {
  return ASPECT_RATIOS.find((r) => r.id === id) ?? ASPECT_RATIOS[0];
}

/** Helper: pick a model by id. */
export function getModel(id: string) {
  return MODELS.find((m) => m.id === id) ?? MODELS[0];
}

/** Helper: pick a style preset by id. */
export function getStyle(id: string) {
  return STYLE_PRESETS.find((s) => s.id === id) ?? STYLE_PRESETS[0];
}
