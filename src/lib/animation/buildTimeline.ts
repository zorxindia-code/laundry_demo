import { gsap } from "gsap";
import {
  beats,
  COPY_FADE,
  copyTiming,
  HANDOVER_IN,
  HANDOVER_LAG,
  HANDOVER_OUT,
  handovers,
  scenes,
  stageTracks,
  STAIN_RESTING_OPACITY,
  stainReveal,
  TIMELINE_LENGTH,
  washGlints,
  type Layout,
  type Tracks,
} from "./scenes";

type Targets = {
  stage: HTMLElement;
  header: HTMLElement | null;
};

const CANVAS = "#eef9f8";
const INK = "#062e3d";
const WHITE = "#ffffff";

/** Turns keyframe tracks into back-to-back fromTo tweens on the stage. */
function addTracks(tl: gsap.core.Timeline, target: Element, tracks: Tracks) {
  for (const [prop, keys] of Object.entries(tracks)) {
    for (let i = 1; i < keys.length; i++) {
      const [at0, v0] = keys[i - 1];
      const [at1, v1, ease = "none"] = keys[i];
      if (at1 === at0) continue;
      tl.fromTo(
        target,
        { [prop]: v0 },
        { [prop]: v1, duration: at1 - at0, ease, immediateRender: false },
        at0,
      );
    }
  }
}

function all(stage: HTMLElement, selector: string) {
  return Array.from(stage.querySelectorAll<HTMLElement>(selector));
}

/** Header retint (white over the drum interior), as a reversible scrub. */
function tintHeader(tl: gsap.core.Timeline, header: HTMLElement | null, dark: boolean, at: number, d: number) {
  if (!header) return;
  const from = dark
    ? { "--hdr-ink": INK, "--hdr-cta-bg": INK, "--hdr-cta-ink": WHITE }
    : { "--hdr-ink": WHITE, "--hdr-cta-bg": WHITE, "--hdr-cta-ink": INK };
  const to = dark
    ? { "--hdr-ink": WHITE, "--hdr-cta-bg": WHITE, "--hdr-cta-ink": INK }
    : { "--hdr-ink": INK, "--hdr-cta-bg": INK, "--hdr-cta-ink": WHITE };
  tl.fromTo(header, from, { ...to, duration: d, immediateRender: false }, at);
}

function addCopy(tl: gsap.core.Timeline, stage: HTMLElement, { desktop }: Layout, motion: boolean) {
  for (const [id, [inAt, outAt]] of Object.entries(copyTiming)) {
    const el = stage.querySelector<HTMLElement>(`[data-copy="${id}"]`);
    if (!el) continue;
    // Copy slides 24px in from its own side (from below on mobile).
    const side = el.dataset.side === "left" ? -1 : 1;
    const offset = !motion ? {} : desktop ? { x: 24 * side } : { y: 24 };
    const rest = motion ? { x: 0, y: 0 } : {};
    if (inAt > 0) {
      tl.fromTo(
        el,
        { autoAlpha: 0, ...offset },
        { autoAlpha: 1, ...rest, duration: COPY_FADE, ease: "sine.out", immediateRender: false },
        inAt,
      );
    }
    if (outAt !== null) {
      const exit = !motion ? {} : desktop ? { x: -12 * side } : { y: -16 };
      tl.fromTo(
        el,
        { autoAlpha: 1, ...rest },
        { autoAlpha: 0, ...exit, duration: COPY_FADE, ease: "sine.in", immediateRender: false },
        outAt,
      );
    }
  }
}

function addProgress(tl: gsap.core.Timeline, stage: HTMLElement) {
  const fill = stage.querySelector("[data-thread-fill]");
  if (fill) tl.fromTo(fill, { scaleY: 0 }, { scaleY: 1, duration: TIMELINE_LENGTH, immediateRender: false }, 0);
  all(stage, "[data-thread-step]").forEach((step, i) => {
    const { start, end } = scenes[i];
    tl.fromTo(step, { opacity: 0.35 }, { opacity: 1, duration: 0.6, immediateRender: false }, Math.max(0, start - 0.6));
    if (end < TIMELINE_LENGTH) {
      tl.fromTo(step, { opacity: 1 }, { opacity: 0.35, duration: 0.6, immediateRender: false }, end - 0.6);
    }
  });
}

function fadeLetters(
  tl: gsap.core.Timeline,
  letters: HTMLElement[],
  at: number,
  span: number,
  from: gsap.TweenVars,
) {
  tl.fromTo(
    letters,
    { autoAlpha: 0, ...from },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: span * 0.6,
      ease: "sine.out",
      stagger: { amount: span * 0.4 },
      immediateRender: false,
    },
    at,
  );
}

/** The full film: one scrubbed timeline drives every layer. */
export function buildStoryTimeline(tl: gsap.core.Timeline, { stage, header }: Targets, layout: Layout) {
  addTracks(tl, stage, stageTracks(layout));

  // Environment: pale aqua deepens to teal once we're through the glass.
  tl.fromTo(stage, { backgroundColor: CANVAS }, { backgroundColor: INK, duration: beats.toDeep[1] - beats.toDeep[0], immediateRender: false }, beats.toDeep[0]);
  tl.fromTo(stage, { backgroundColor: INK }, { backgroundColor: CANVAS, duration: beats.toCanvas[1] - beats.toCanvas[0], immediateRender: false }, beats.toCanvas[0]);
  tintHeader(tl, header, true, beats.toDeep[0], beats.toDeep[1] - beats.toDeep[0]);
  tintHeader(tl, header, false, beats.toCanvas[0], beats.toCanvas[1] - beats.toCanvas[0]);

  // Machine: the back plate shows the whole machine; the front copy (rim and
  // body only) sits over the shirt while it is inside the glass.
  const back = stage.querySelector("[data-machine='back']");
  const front = stage.querySelector("[data-machine='front']");
  tl.set(back, { autoAlpha: 1 }, beats.machineIn);
  tl.set(front, { autoAlpha: 1 }, beats.frontRimOn);
  tl.set([back, front], { autoAlpha: 0 }, beats.machineHidden);
  tl.set([back, front], { autoAlpha: 1 }, beats.machineBack);
  tl.set(front, { autoAlpha: 0 }, beats.frontRimOff);
  tl.set(back, { autoAlpha: 0 }, beats.machineOut);

  // Dirty-shirt stains: tired at 35%, snapping up as the raking light passes.
  for (const [id, at] of Object.entries(stainReveal)) {
    const stain = stage.querySelector(`[data-stain="${id}"]`);
    const callout = stage.querySelector(`[data-callout="${id}"]`);
    tl.fromTo(stain, { opacity: STAIN_RESTING_OPACITY }, { opacity: 1, duration: 1.5, ease: "sine.out", immediateRender: false }, at);
    tl.fromTo(callout, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, immediateRender: false }, at + 0.5);
    tl.fromTo(callout, { autoAlpha: 1 }, { autoAlpha: 0, duration: beats.callouts[1] - beats.callouts[0], immediateRender: false }, beats.callouts[0]);
  }

  // The shirt's states hand over while the rig keeps turning: incoming on
  // top first, outgoing out underneath, so it reads as one garment.
  for (const { from, to, at } of handovers) {
    tl.fromTo(`[data-shirt='${to}']`, { autoAlpha: 0 }, { autoAlpha: 1, duration: HANDOVER_IN, ease: "sine.inOut", immediateRender: false }, at);
    tl.fromTo(`[data-shirt='${from}']`, { autoAlpha: 1 }, { autoAlpha: 0, duration: HANDOVER_OUT, ease: "sine.inOut", immediateRender: false }, at + HANDOVER_LAG);
  }
  // A mint glint as each wash step finishes (the stain fade itself is the
  // --wash-stain track).
  for (const { layer, at } of washGlints) {
    const glints = all(stage, `[data-glint="${layer}"]`);
    tl.fromTo(glints, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: "sine.out", immediateRender: false }, at - 0.6);
    tl.fromTo(glints, { autoAlpha: 1, scale: 1 }, { autoAlpha: 0, scale: 0.6, duration: 1, ease: "sine.in", immediateRender: false }, at + 0.2);
  }
  // Foam softens the one handover the stills can't bridge on their own:
  // the open wet shirt to the pressed-pose clean one.
  const [f0, f1, f2] = beats.foam;
  tl.fromTo("[data-foam]", { autoAlpha: 0 }, { autoAlpha: 0.45, duration: f1 - f0, immediateRender: false }, f0);
  tl.fromTo("[data-foam]", { autoAlpha: 0.45 }, { autoAlpha: 0, duration: f2 - f1, immediateRender: false }, f1);

  tl.fromTo("[data-caustics]", { backgroundPosition: "0% 0%" }, { backgroundPosition: "100% 70%", duration: 33, ease: "sine.inOut", immediateRender: false }, 33);

  // Steam band for the press.
  const [s0, s1, s2, s3] = beats.steam;
  tl.fromTo("[data-steam]", { autoAlpha: 0 }, { autoAlpha: 1, duration: s1 - s0, immediateRender: false }, s0);
  tl.fromTo("[data-steam]", { autoAlpha: 1 }, { autoAlpha: 0, duration: s3 - s2, immediateRender: false }, s2);

  // Giant words: DIRTY drifts up and away; CLEAN forms in the drum; FRESH lands.
  const [d0, d1] = beats.dirtyWordOut;
  tl.fromTo("[data-word='dirty']", { autoAlpha: 1, yPercent: 0 }, { autoAlpha: 0, yPercent: -30, duration: d1 - d0, ease: "sine.in", immediateRender: false }, d0);
  const [c0, c1, c2, c3] = beats.cleanWord;
  fadeLetters(tl, all(stage, "[data-word='clean'] [data-letter]"), c0, c1 - c0, { y: 40, scale: 0.6 });
  tl.fromTo("[data-word='clean']", { autoAlpha: 1 }, { autoAlpha: 0, duration: c3 - c2, immediateRender: false }, c2);
  const [w0, w1] = beats.freshWord;
  fadeLetters(tl, all(stage, "[data-word='fresh'] [data-letter]"), w0, w1 - w0, { y: 60 });

  addCopy(tl, stage, layout, true);
  addProgress(tl, stage);
  tl.set({}, {}, TIMELINE_LENGTH);
}

/**
 * prefers-reduced-motion: three still states (dirty, the machine, fresh)
 * cross-faded on scroll, nothing moving, all copy intact.
 */
export function buildReducedTimeline(tl: gsap.core.Timeline, { stage }: Targets, { desktop }: Layout) {
  gsap.set(stage, {
    // Centred, so neither copy column runs into the still shirt.
    "--s-x": 0,
    "--s-y": desktop ? -2 : -9,
    "--s-r": 0,
    "--float": 0,
    "--m-y": 0,
    "--m-s": 1,
    "--press": 1,
  });
  gsap.set("[data-stain]", { opacity: 1 });

  const back = stage.querySelector("[data-machine='back']");
  const fade = (target: gsap.TweenTarget, from: number, to: number, at: number) =>
    tl.fromTo(target, { autoAlpha: from }, { autoAlpha: to, duration: 3, immediateRender: false }, at);

  // Fade the shirt layers, never the rig: GSAP records a child of a hidden
  // parent as hidden, which would then be restored on scrubbing back.
  fade("[data-shirt='dirty']", 1, 0, 30);
  fade("[data-floor-shadow]", 1, 0, 30);
  fade(back, 0, 1, 31);
  fade(back, 1, 0, 64);
  fade("[data-shirt='clean']", 0, 1, 65);
  fade("[data-floor-shadow]", 0, 1, 65);
  fade("[data-word='dirty']", 1, 0, 15);
  tl.fromTo("[data-word='fresh'] [data-letter]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 3, immediateRender: false }, 87);

  addCopy(tl, stage, { desktop }, false);
  addProgress(tl, stage);
  tl.set({}, {}, TIMELINE_LENGTH);
}
