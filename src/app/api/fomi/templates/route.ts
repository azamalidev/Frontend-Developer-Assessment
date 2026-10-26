import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-static";

/** Curated prompt + style preset templates surfaced in the prompt bar
 *  "Templates" badge and the empty-state view. */
const TEMPLATES = [
  {
    id: "t1",
    title: "Editorial Portrait",
    prompt:
      "Editorial portrait, soft window light, three-quarter view, candid expression, premium magazine quality",
    preview: "/seed-images/woman-1.png",
    tags: ["portrait", "editorial", "fashion"],
    modelId: "fomi-pro",
    styleId: "editorial",
  },
  {
    id: "t2",
    title: "Surreal Dreamscape",
    prompt:
      "Surreal dreamscape, floating staircases in blue sky, cinematic wide angle, dreamlike",
    preview: "/seed-images/thumb-1.png",
    tags: ["surreal", "landscape", "cinematic"],
    modelId: "fomi-vivid",
    styleId: "cinematic",
  },
  {
    id: "t3",
    title: "Liquid Chrome",
    prompt:
      "Liquid chrome abstract, iridescent reflections, dark studio backdrop, macro detail",
    preview: "/seed-images/thumb-2.png",
    tags: ["abstract", "product", "studio"],
    modelId: "fomi-flux",
    styleId: "3d-render",
  },
  {
    id: "t4",
    title: "Neon Street",
    prompt:
      "Cyberpunk neon street at night, rainy reflections, atmospheric, cinematic still",
    preview: "/seed-images/thumb-3.png",
    tags: ["cyberpunk", "scene", "night"],
    modelId: "fomi-vivid",
    styleId: "cinematic",
  },
  {
    id: "t5",
    title: "Golden Hour",
    prompt:
      "Mountain cabin in pine forest at golden hour, warm window light, photorealistic landscape",
    preview: "/seed-images/thumb-4.png",
    tags: ["landscape", "warm", "scene"],
    modelId: "fomi-pro",
    styleId: "auto",
  },
  {
    id: "t6",
    title: "Macro Flora",
    prompt:
      "Macro photograph of vibrant tropical flower, pink and orange petals, blurred green background, fine detail",
    preview: "/seed-images/thumb-5.png",
    tags: ["macro", "nature", "color"],
    modelId: "fomi-pro",
    styleId: "product",
  },
];

export async function GET() {
  return NextResponse.json({ templates: TEMPLATES });
}
