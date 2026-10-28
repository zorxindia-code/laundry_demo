# The Clean Thread — architecture notes

How the build realises `docs/creative-direction.md`, and what still waits on production assets.

## Page

`src/app/page.tsx` (server) → `Header` · `StoryStage` (the only animated client component) · `HowItWorks` · `ServicesList` · `Proof` · `FinalCta` (+ client `BookingForm`) · `Footer`.

All copy is real HTML in reading order. Business facts live in `src/content/site.ts`; anything with `confirmed: false` renders with a dashed underline (`FactText`) until the client supplies it.

## The film

- **Pinning:** `.story-section` is 900svh at 1024px and wider, 600svh below that; `.story-stage` inside it is `position: sticky`. CSS pinning keeps React in charge of the DOM (no GSAP pin-spacer).
- **One clock:** one `ScrollTrigger` (`scrub: 0.8`) drives one timeline, 100 units long, so every position is a percentage of the stage. Built in `src/lib/animation/buildTimeline.ts`, inside `gsap.matchMedia` (desktop / mobile / reduced), and reverted on unmount by `useGSAP`.
- **Choreography as data:** `src/lib/animation/scenes.ts` holds the scene ranges, copy timing, stain timing and keyframe tracks for the stage's CSS variables. Retime a scene there, not in the builder.
- **Stage variables:** the timeline animates unitless variables on `.story-stage` (`--s-x/y/r/s` shirt, `--m-y/s` machine, `--drum-o`, `--press`, …). Each layer composes its transform from them in container units (`cqw`/`cqh`), so the shirt, porthole clip and floor shadow stay locked together at any size.
- **Header:** sits outside the stage; the same timeline retints it (`--hdr-*`) inside the drum.

### Washing-machine pass-through (layering on a flat image)

1. `MachineBack`: the whole approved still, transform origin at the measured porthole centre (478, 356; r = 132 on the 818 × 782 canvas, in `manifest.ts → geometry`).
2. `DrumInterior`: a `clip-path` circle computed from the same variables, so it always matches the glass. It fills the screen as the machine scales up to 8×.
3. Shirt rig.
4. `MachineFront`: the same still masked to rim and body only, switched on while the shirt is inside the glass, so the glass reads as in front of it.

The background swaps colour only while the enlarged machine covers the whole screen. The push-in stops at 6.8×, just enough to cover a 1920 × 1080 screen, so the machine raster is enlarged no more than needed. This is a convincing 2D illusion, not a 3D camera move, and the door does not open.

### The wash: five stills, one garment

Inside the rig, the shirt's states are stacked in hand-over order: `dirty → open → compact → unfold → clean`. `unfold` is the open reference reused once its stains are gone. `handovers` in `scenes.ts` schedules each change: the incoming state fades in on top over 2.5 units, then the outgoing one fades out beneath it, 1.5 units later. The fabric is opaque, so this hides most of the ghosting, and the rig keeps turning throughout.

| Units | Phase | State | Motion (stage tracks) |
| --- | --- | --- | --- |
| 33–38 | Entry | dirty → open | Steady spin while the camera pushes through the glass |
| 39–48 | Agitation | open | Slow, uneven turn; drifts across the drum, away from the copy; perspective wobble |
| 48–52 | Into the fold | open → compact | Spin accelerates and scale tightens |
| 52–60 | Spin | compact | About 30°/unit; the drum is at its fastest |
| 58.5–62 | Release | compact → unfold | Decelerates and opens out |
| 62.5–66 | Clean reveal | unfold → clean | Eases nearly upright under a soft foam bloom |

The wet states' stains fade through one stage variable, `--wash-stain` (1 → 0.62 → 0.3 → 0), in step with the three wash service lines, with a mint glint on the visible state as each step finishes.

## Assets

| File | Status | Used in |
| --- | --- | --- |
| `public/images/story/dirty-shirt.png` | Approved original | Source for the derived layers below |
| `public/images/story/derived/dirty-shirt-base.png`, `stain-*.png` | Derived from the approved dirty shirt by `scripts/derive-stain-layers.py`; stacked, they recombine to the original | Scenes 01–05 |
| `public/images/story/clean-shirt.png` | Approved original | Scenes 05 (crossfade) – 08, final CTA |
| `public/images/story/washing-machine.png` | Approved original | Scenes 03–06; its water also feeds the drum plate |
| `assets/reference/wash-open.png`, `wash-compact.png` | Approved wet-shirt references (RGB on black, no alpha), kept unmodified and not served | Source for the cutouts below |
| `public/images/story/wash/{open,compact}-base.png`, `-stains.png` | Cut out by `scripts/cutout-wash-states.py`; base and overlay recombine to the reference | Scene 05 |
| `assets/reference/wash-diptych-unused.png` | Supplied, deliberately not used | Its grey-black soil and creamier fabric read as a different shirt |

**How the wet stills were cut out.** A subject lit on black is already "premultiplied over black", so only alpha has to be solved. The garment (large bright connected regions, closed and hole-filled) is made fully opaque, so fold shadows stay dark. Its last 3px, and all the water, foam and droplets, take a luminance alpha with colour recovered as C/α. This is a real alpha channel, not a CSS blend mode, so the white fabric keeps its shadows. Remaining artefacts: a few bubbles whose centres were dark in the original still show dark specks. They're invisible over the deep drum teal, the only background these states appear on.

All three stills are 818 × 782. They look soft on high-DPI screens at full size, and the machine is upscaled heavily during the push-in. Ask for at least 2× resolution.

`src/lib/assets/manifest.ts` declares every layer. It already types a `FrameSequence` entry for the planned renders. Adding a canvas renderer for that type and pointing the shirt and machine roles at sequences replaces the stills without touching the timeline.

## Still needs rendered frames

- Real cloth motion. The wash now passes through two photographed wet states (open, compact), but every state is still a rigid image that moves, rotates and crossfades. Sleeves don't actually fold between them, and wrinkles don't flatten under steam.
- The largest remaining jump is from the open wet shirt to the pressed-pose clean shirt; foam softens it. One or two in-between renders would close it: the wet shirt partly unfolded, then the clean shirt still damp and slightly twisted, on the same 1283 × 1226 black-background setup, or better, as transparent PNGs.
- The wet references are a different photograph from the approved dirty and clean stills. Their stains are veined brown rather than coffee splashes. Inside the moving drum that reads fine, but a renderer working from one 3D shirt would remove the mismatch.
- The door opening on exit, the machine's own floor shadow, the drum's water and foam simulation, and the silk scarf in scene 05.
- Separate stain masks from the render pass, to replace the derived hue key.

## Deviations from the brief

- **Stain labels** follow the approved asset: Collar, Coffee, Smudges, Cuffs. The brief's Ink and Grass don't exist on that shirt.
- **Wash order** follows the client's instruction: stains dissolve one group at a time with their service lines, then the dirty shirt crossfades to the clean one late in the wash. The clean shirt leaves the drum looking damp, and the steam pass wipes the damp layer away.
- **Small teal text** uses a darkened teal (`#0D7468`) because `#5CDBC5` fails contrast on the pale canvas. The bright teal is kept for the thread and the scene numbers.
- **Side-by-side layout** starts at 1024px. Portrait tablets use the stacked phone composition.

## Known gotchas

- The wash stills share the rig box with the dirty shirt because both canvases are 1.046:1. `geometry.washFit` re-centres them, and scales the compact one to 0.85× so it reads as the same shirt bunched up.

- GSAP reads `autoAlpha` as 0 when an element's computed visibility is hidden, and visibility is inherited. Don't fade a parent and its children with overlapping tweens, or scrubbing back restores the wrong state.
- Custom classes in `globals.css` compile unlayered and beat Tailwind utilities. Don't set the same property in both.
- If a CSS change doesn't show up, delete `.next` and rebuild; incremental builds have served a stale stylesheet.
