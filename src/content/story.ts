/**
 * Scene copy for the pinned film, in reading order. Timing lives in
 * src/lib/animation/scenes.ts and refers to these ids.
 */

export type CopySide = "left" | "right";

export type SceneCopy = {
  id: string;
  /** Desktop column; on mobile every block sits under the shirt. */
  side: CopySide;
  /** Set inside the drum, where the canvas turns deep teal. */
  onDark?: boolean;
  tag?: string;
  headline?: string;
  body?: string;
};

export const sceneCopy: SceneCopy[] = [
  {
    id: "s02",
    side: "right",
    tag: "Pickup & Delivery",
    headline: "Life happens to your clothes.",
    body: "Coffee on the commute, grass at the weekend match. We collect it all from your door.",
  },
  {
    id: "s04",
    side: "left",
    onDark: true,
    tag: "Wash & Fold",
    headline: "In it goes.",
    body: "Sorted by colour and fabric, washed at the right temperature, folded by hand.",
  },
  {
    id: "s05a",
    side: "right",
    onDark: true,
    tag: "Stain Treatment",
    body: "Every mark pre-treated by hand before it ever meets water.",
  },
  {
    id: "s05b",
    side: "left",
    onDark: true,
    tag: "Delicate Fabric Care",
    body: "Silks, wools and linens get their own gentle cycle.",
  },
  {
    id: "s05c",
    side: "right",
    onDark: true,
    tag: "Dry Cleaning",
    body: "For the pieces water can't touch, solvent-free professional dry cleaning.",
  },
  {
    id: "s07",
    side: "left",
    tag: "Ironing & Pressing",
    headline: "Pressed, not just dried.",
    body: "Steam-pressed, collars set, ready on a hanger.",
  },
];

/** One-word labels for the scene 02 callouts, matching the stains in the asset. */
export const stainLabels = {
  collar: "Collar",
  coffee: "Coffee",
  smudges: "Smudges",
  cuffs: "Cuffs",
} as const;

export const progressScenes = [
  "Suspended",
  "The Reveal",
  "The Tumble",
  "Into the Glass",
  "The Wash",
  "Release",
  "The Press",
  "Fresh",
] as const;
