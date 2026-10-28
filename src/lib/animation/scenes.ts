/**
 * The film's choreography as data. The master timeline is 100 units long, so
 * every `at` below is a percentage of the pinned stage (creative direction §E).
 */

export const TIMELINE_LENGTH = 100;

export const scenes = [
  { n: "01", id: "suspended", start: 0, end: 8 },
  { n: "02", id: "reveal", start: 8, end: 20 },
  { n: "03", id: "tumble", start: 20, end: 30 },
  { n: "04", id: "into-glass", start: 30, end: 40 },
  { n: "05", id: "wash", start: 40, end: 65 },
  { n: "06", id: "release", start: 65, end: 76 },
  { n: "07", id: "press", start: 76, end: 86 },
  { n: "08", id: "fresh", start: 86, end: 100 },
] as const;

/** [at, value, ease into this key] */
export type Key = readonly [number, number, string?];
export type Tracks = Record<string, Key[]>;

export type Layout = { desktop: boolean };

/**
 * Stage-variable tracks (see `.story-stage` in globals.css): shirt offset in
 * cqw/cqh from centre, rotation in degrees, scale; machine offset and scale.
 */
export function stageTracks({ desktop }: Layout): Tracks {
  // Below 1024px the shirt stays centred and sits higher, above the copy.
  const X = (v: number) => (desktop ? v : v * 0.15);
  const Y = (v: number) => (desktop ? v : v * 0.6);
  const rest = desktop ? -2 : -9;

  return {
    "--s-x": [
      [0, X(8)],
      [8, X(8)],
      [20, X(-16), "sine.inOut"],
      [30, X(-3), "sine.inOut"],
      [33, 0, "sine.in"],
      // In the drum: carried across it by the water, always drifting away
      // from whichever side the service copy is on.
      [39, 0],
      [43, X(-5), "sine.inOut"],
      [47, X(-3), "sine.inOut"],
      [52, X(4), "sine.inOut"],
      [56, X(5), "sine.inOut"],
      [60, X(-5), "sine.inOut"],
      [64, X(-4), "sine.inOut"],
      // Back to the porthole's centre before the pull-back closes it in.
      [68, 0, "sine.inOut"],
      [70, 0],
      [76, X(14), "power2.out"],
      [86, X(12), "sine.inOut"],
      [93, X(-10), "sine.inOut"],
    ],
    "--s-y": [
      [0, rest],
      [8, rest],
      [20, desktop ? 4 : -6, "sine.inOut"],
      [30, desktop ? 10 : 4, "sine.in"],
      [33, 0, "sine.in"],
      [39, 0],
      [43, Y(1.5), "sine.inOut"],
      [47, Y(-1.5), "sine.inOut"],
      [52, Y(1), "sine.inOut"],
      [56, Y(-1), "sine.inOut"],
      [60, Y(1), "sine.inOut"],
      [64, 0, "sine.inOut"],
      [70, 0],
      [76, desktop ? -4 : -10, "power2.out"],
      [86, rest],
      [93, desktop ? 0 : -8, "sine.inOut"],
    ],
    "--s-r": [
      [0, 6],
      [8, 6],
      [20, -4, "sine.inOut"],
      [30, 160, "power1.in"],
      [33, 175, "none"],
      // Wash: an uneven tumble while open, a fast spin once it folds, then it
      // slows and comes out nearly upright for the clean reveal.
      [39, 225, "none"],
      [47, 270, "sine.inOut"],
      [52, 360, "power1.in"],
      [60, 600, "none"],
      [64, 680, "power2.out"],
      [66.5, 700, "sine.out"],
      [76, 720, "power2.out"],
    ],
    "--s-ry": [
      [8, 0],
      [20, -14, "sine.inOut"],
      [26, 0, "sine.inOut"],
      // Water resistance: the garment tips back and forth as it is carried.
      [35, 0],
      [41, 10, "sine.inOut"],
      [46, -8, "sine.inOut"],
      [52, 6, "sine.inOut"],
      [57, -6, "sine.inOut"],
      [62, 4, "sine.inOut"],
      [66, 0, "sine.inOut"],
    ],
    "--s-s": [
      [0, 1],
      [20, 1],
      [30, 0.8, "sine.in"],
      [33, 0.58, "sine.inOut"],
      [38, 0.7, "sine.inOut"],
      // Large enough in the drum to be the subject, not a sticker on it.
      [42, desktop ? 1.3 : 1.1, "sine.out"],
      [47, desktop ? 1.3 : 1.1],
      [52, desktop ? 1.2 : 1.02, "sine.inOut"],
      [60, desktop ? 1.2 : 1.02],
      [64, desktop ? 1.08 : 1, "sine.inOut"],
      [65, desktop ? 1.06 : 0.98],
      [69, 0.75, "sine.inOut"],
      [76, 1, "power2.out"],
      [86, 1],
      [93, 1.05, "sine.inOut"],
    ],
    // Hanger settle: the one place an overshoot is allowed.
    "--s-pend": [
      [86, 0],
      [92, 3, "sine.out"],
      [98, 0, "elastic.out(1, 0.45)"],
    ],
    "--float": [
      [0, 1],
      [5, 0, "sine.out"],
      [93, 0],
      [99, 1, "sine.in"],
    ],
    "--shadow-o": [
      [0, 0.55],
      [20, 0.55],
      [26, 0],
      [76, 0],
      [82, 0.5],
      [93, 0.6],
    ],
    "--m-y": [
      [0, 110],
      [20, 110],
      [30, 20, "power2.out"],
      [33, 0, "sine.inOut"],
      [69, 0],
      [76, 110, "power2.in"],
    ],
    // Push in just until the porthole covers a 1920 × 1080 screen (6.8×), then
    // pull back out; any further and the machine raster only gets softer.
    "--m-s": [
      [30, 1],
      [33, 2.2, "sine.inOut"],
      [38, 6.8, "power2.in"],
      [65, 6.8],
      [69, 2.2, "power2.out"],
      [76, 1.2, "sine.in"],
    ],
    "--drum-o": [
      [32, 0],
      [35, 1],
      [66, 1],
      [69, 0],
    ],
    "--drum-r": [
      [33, 0],
      [47, 140, "sine.in"],
      [52, 330, "power1.in"],
      [60, 780, "none"],
      [66, 900, "power2.out"],
      [70, 930, "power2.out"],
    ],
    // Stains on the wet states fade in three steps, one per wash service.
    "--wash-stain": [
      [41, 1],
      [47, 0.62, "sine.inOut"],
      [49, 0.62],
      [55, 0.3, "sine.inOut"],
      [57, 0.3],
      [62, 0, "sine.inOut"],
    ],
    "--rake": [
      [9, 0],
      [17, 1, "sine.inOut"],
    ],
    "--press": [
      [78, 0],
      [85, 1, "sine.inOut"],
    ],
  };
}

/** Copy blocks: [fade in start, fade out start]; null = stays to the end. */
export const copyTiming: Record<string, readonly [number, number | null]> = {
  s01: [0, 3],
  s02: [9.5, 18.5],
  s04: [35.5, 39],
  s05a: [41, 47],
  s05b: [49, 55],
  s05c: [57, 63.5],
  s07: [77, 85],
  s08: [88, null],
};
/** Each fade takes this many units (about 10% of a typical scene). */
export const COPY_FADE = 1.5;

/** Dirty-shirt stains snap up under the raking light (they wash out on the wet states). */
export const stainReveal = { collar: 10, coffee: 12, smudges: 14, cuffs: 16 } as const;
export const STAIN_RESTING_OPACITY = 0.35;

export const beats = {
  machineIn: 20,
  frontRimOn: 33,
  machineHidden: 38.5,
  machineBack: 64.5,
  frontRimOff: 70,
  machineOut: 76.5,
  // Only while the enlarged machine covers the whole screen, so the swap is unseen.
  toDeep: [36.2, 37.2],
  toCanvas: [65.4, 66.4],
  foam: [62, 63.8, 66.5],
  steam: [77, 78.5, 84.5, 86],
  dirtyWordOut: [15, 20],
  cleanWord: [44, 56, 63, 66],
  freshWord: [87, 93],
  callouts: [18, 19.5],
} as const;

/**
 * The shirt's states hand over in this order. Each incoming state fades in on
 * top first, then the outgoing one fades out beneath it, so the opaque fabric
 * hides most of the ghosting while the rig keeps turning.
 */
export const HANDOVER_IN = 2.5;
export const HANDOVER_OUT = 2;
export const HANDOVER_LAG = 1.5;
export const handovers = [
  { from: "dirty", to: "open", at: 34.5 },
  { from: "open", to: "compact", at: 48 },
  { from: "compact", to: "unfold", at: 58.5 },
  { from: "unfold", to: "clean", at: 62.5 },
] as const;

/** A mint glint as each wash step finishes, on the state visible at that moment. */
export const washGlints = [
  { layer: "open", at: 46.6 },
  { layer: "compact", at: 54.6 },
  { layer: "unfold", at: 61.6 },
] as const;
