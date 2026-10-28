/**
 * Every visual the story uses, in one place. Swap a `static` entry for a
 * `sequence` entry (and add a renderer for it) when the pre-rendered cloth and
 * machine frames exist; the timeline only addresses layers by role.
 */

export type StaticImage = {
  kind: "static";
  src: string;
  width: number;
  height: number;
  alt: string;
};

/** Reserved for the production renders described in the creative direction. */
export type FrameSequence = {
  kind: "sequence";
  /** e.g. "/animation/shirt/desktop/{frame}.webp" */
  pattern: string;
  frames: number;
  width: number;
  height: number;
  mobilePattern?: string;
};

export type LayerSource = StaticImage | FrameSequence;

const STORY = "/images/story";

/** All approved stills share one 818 × 782 transparent canvas. */
export const CANVAS = { width: 818, height: 782 } as const;

const still = (src: string, alt = ""): StaticImage => ({ kind: "static", src, alt, ...CANVAS });

/** The wet-shirt references share a 1283 × 1226 canvas: the same aspect as CANVAS. */
const WASH_CANVAS = { width: 1283, height: 1226 } as const;
const washStill = (src: string, alt = ""): StaticImage => ({ kind: "static", src, alt, ...WASH_CANVAS });

export const assets = {
  /** Approved original; the four stain layers + base below recombine to it. */
  dirtyShirt: still(`${STORY}/dirty-shirt.png`, "White shirt marked with coffee and grime"),
  /** Derived from dirtyShirt by scripts/derive-stain-layers.py. */
  dirtyShirtBase: still(`${STORY}/derived/dirty-shirt-base.png`, "White shirt marked with coffee and grime"),
  stains: {
    collar: still(`${STORY}/derived/stain-collar.png`),
    coffee: still(`${STORY}/derived/stain-coffee.png`),
    smudges: still(`${STORY}/derived/stain-smudges.png`),
    cuffs: still(`${STORY}/derived/stain-cuffs.png`),
  },
  cleanShirt: still(`${STORY}/clean-shirt.png`, "The same white shirt, washed and pressed"),
  washingMachine: still(`${STORY}/washing-machine.png`, "Front-loading washing machine"),
  /**
   * Wet states inside the drum, cut from the references in assets/reference/
   * by scripts/cutout-wash-states.py: a stain-free base plus a stain overlay
   * that together recombine to the reference.
   */
  wash: {
    open: {
      base: washStill(`${STORY}/wash/open-base.png`, "The shirt twisting open in soapy water"),
      stains: washStill(`${STORY}/wash/open-stains.png`),
    },
    compact: {
      base: washStill(`${STORY}/wash/compact-base.png`, "The shirt bunched into a fold in the spin"),
      stains: washStill(`${STORY}/wash/compact-stains.png`),
    },
  },
} satisfies Record<string, LayerSource | Record<string, LayerSource | Record<string, LayerSource>>>;

export type StainId = keyof typeof assets.stains;
export type WashStateId = keyof typeof assets.wash;

/**
 * Geometry measured on the source pixels, as fractions of the canvas, so the
 * timeline can line layers up without knowing the rendered size.
 */
export const geometry = {
  /** Porthole glass in washing-machine.png: centre (478, 356), radius 132px. */
  porthole: { cx: 478 / 818, cy: 356 / 782, r: 132 / 818 },
  /**
   * The clean shirt is drawn smaller and slightly left of the dirty one;
   * this matches their visible heights and centres for the crossfade.
   */
  cleanShirtFit: { scale: 688 / 641, offsetX: 9 / 818 },
  /** Stain centres in the dirty-shirt canvas (fractions), for callouts and glints. */
  stainPoints: {
    collar: [{ x: 0.49, y: 0.1 }],
    coffee: [{ x: 0.57, y: 0.38 }],
    smudges: [{ x: 0.44, y: 0.53 }],
    cuffs: [
      { x: 0.17, y: 0.82 },
      { x: 0.76, y: 0.82 },
    ],
  } satisfies Record<StainId, { x: number; y: number }[]>,
  /**
   * Fits each wet state to the dirty shirt in the shared rig box. The open
   * shirt covers the same area (0.454 vs 0.456 of the box), so it only needs
   * re-centring; the compact one is framed tighter and is scaled down so it
   * reads as the same shirt bunched up, not a bigger one.
   */
  washFit: {
    open: { scale: 1, offsetX: -0.024, offsetY: 0.051 },
    // Offset applies after the scale (origin at the box centre).
    compact: { scale: 0.85, offsetX: -0.023, offsetY: 0.041 },
  } satisfies Record<WashStateId, { scale: number; offsetX: number; offsetY: number }>,
  /** Largest stain clusters in each wet state (fractions), for the mint glints. */
  washStainPoints: {
    open: [
      { x: 0.355, y: 0.304 },
      { x: 0.59, y: 0.769 },
      { x: 0.286, y: 0.16 },
      { x: 0.463, y: 0.243 },
    ],
    compact: [
      { x: 0.603, y: 0.391 },
      { x: 0.293, y: 0.637 },
    ],
  } satisfies Record<WashStateId, { x: number; y: number }[]>,
} as const;
