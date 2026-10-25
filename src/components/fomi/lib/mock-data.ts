/**
 * Mock data for the Fomi platform — history, projects, sessions.
 * Used to populate the Part B workspace with realistic state on first load.
 */

export type GenerationStatus = "complete" | "running" | "queued" | "failed";

export interface Shot {
  id: string;
  prompt: string;
  modelId: string;
  styleId: string;
  aspectId: string;
  seed: number;
  status: GenerationStatus;
  createdAt: string; // ISO
  imageUrl: string;
  /** Optional: extracted dominant palette (hex strings). */
  palette?: string[];
  /** Variations (alternative seeds) of the same prompt. */
  variations?: Shot[];
  /** Was this shot starred by the user? */
  starred?: boolean;
  /** Number of remix descendants that used this shot as a reference. */
  remixCount?: number;
}

export interface Project {
  id: string;
  name: string;
  thumbnail: string;
  /** ISO date of last activity. */
  updatedAt: string;
  /** Total shots in the project. */
  shotCount: number;
  /** Optional brief one-line description shown in the rail. */
  brief: string;
  /** Brand color used for the project chip. */
  accent: string;
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Auburn Editorial",
    thumbnail: "/seed-images/woman-1.png",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    shotCount: 14,
    brief: "Knitwear lookbook for FW campaign",
    accent: "#ff6b4a",
  },
  {
    id: "p2",
    name: "Cloud Staircase",
    thumbnail: "/seed-images/thumb-1.png",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    shotCount: 8,
    brief: "Surreal staircase concept series",
    accent: "#7dd3fc",
  },
  {
    id: "p3",
    name: "Chrome Forms",
    thumbnail: "/seed-images/thumb-2.png",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    shotCount: 22,
    brief: "Liquid metal product studies",
    accent: "#8b5cf6",
  },
  {
    id: "p4",
    name: "Neon District",
    thumbnail: "/seed-images/thumb-3.png",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    shotCount: 5,
    brief: "Cyberpunk film pre-viz",
    accent: "#d4ff3a",
  },
  {
    id: "p5",
    name: "Golden Hour Cabin",
    thumbnail: "/seed-images/thumb-4.png",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    shotCount: 11,
    brief: "Hospitality brand landscape set",
    accent: "#ffb547",
  },
];

/** Build a sample shot list for the initial filmstrip. */
function shot(
  id: string,
  prompt: string,
  imageUrl: string,
  opts: Partial<Shot> = {}
): Shot {
  return {
    id,
    prompt,
    modelId: "fomi-pro",
    styleId: "editorial",
    aspectId: "3:4",
    seed: 1000 + Number(id.replace(/\D/g, "")) * 137,
    status: "complete",
    createdAt: new Date(Date.now() - 1000 * 60 * (60 - Number(id.replace(/\D/g, "")) * 5)).toISOString(),
    imageUrl,
    palette: ["#1e3a4c", "#ff6b4a", "#f4e9d9", "#8a6a4a"],
    starred: false,
    remixCount: 0,
    ...opts,
  };
}

export const MOCK_SHOTS: Shot[] = [
  shot("s1", "Editorial portrait of auburn-haired woman in cream knit sweater, soft window light, candid expression", "/seed-images/woman-1.png", { starred: true, remixCount: 3 }),
  shot("s2", "Three-quarter portrait of red-haired woman in beige cardigan, warm tones, studio backdrop", "/seed-images/woman-2.png", { remixCount: 1 }),
  shot("s3", "Side profile, auburn hair, ivory sweater, cinematic lighting, shallow depth of field", "/seed-images/woman-3.png"),
  shot("s4", "Half-body portrait, cream turtleneck, looking down, fashion magazine style", "/seed-images/woman-4.png", { starred: true }),
  shot("s5", "Candid portrait, ivory knit, natural window light, premium editorial mood", "/seed-images/woman-5.png"),
  shot("s6", "Three-quarter view, auburn hair, off-white cardigan, gentle smile, studio session", "/seed-images/woman-6.png"),
];
