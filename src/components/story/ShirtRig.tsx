import Image from "next/image";
import { assets, geometry, type StainId, type WashStateId } from "@/lib/assets/manifest";
import { stainLabels } from "@/content/story";

const SHIRT_SIZES = "(max-width: 1023px) 92vw, 54vh";
const stainIds = Object.keys(assets.stains) as StainId[];

/**
 * One shirt, every state, stacked in the order they hand over (each incoming
 * state sits above the one it replaces):
 *   dirty   — approved dirty-shirt.png as a stain-free base + four overlays
 *   open    — wet reference A, twisting open in the drum
 *   compact — wet reference B, bunched into a fold in the spin
 *   unfold  — reference A again, stains gone, opening back out
 *   clean   — approved clean-shirt.png, with a damp copy the steam wipes away
 * Every state is a still: the motion comes from the rig's transforms and the
 * overlapping crossfades, not from cloth simulation.
 */
export function ShirtRig() {
  return (
    <div data-shirt-rig className="shirt-rig">
      <div className="shirt-pendulum">
        <div className="shirt-float">
          <div data-shirt="dirty" className="absolute inset-0">
            <Image
              {...assets.dirtyShirtBase}
              alt={assets.dirtyShirtBase.alt}
              sizes={SHIRT_SIZES}
              quality={90}
              preload
              className="shirt-layer"
            />
            {stainIds.map((id) => (
              <Image
                key={id}
                data-stain={id}
                {...assets.stains[id]}
                alt=""
                sizes={SHIRT_SIZES}
                quality={90}
                loading="eager"
                className="shirt-layer"
                style={{ opacity: 0.35 }}
              />
            ))}
            <div className="shirt-layer shirt-rake" />
          </div>

          <WashLayer id="open" state="open" glints={[0, 1]} />
          <WashLayer id="compact" state="compact" glints={[0, 1]} />
          <WashLayer id="unfold" state="open" glints={[2, 3]} />

          <div data-shirt="clean" data-story-hidden className="absolute inset-0">
            <div className="shirt-layer shirt-clean">
              <Image
                {...assets.cleanShirt}
                alt={assets.cleanShirt.alt}
                sizes={SHIRT_SIZES}
                quality={90}
                loading="eager"
                fetchPriority="low"
                className="shirt-layer"
              />
              <Image
                {...assets.cleanShirt}
                alt=""
                sizes={SHIRT_SIZES}
                quality={90}
                loading="eager"
                fetchPriority="low"
                className="shirt-layer shirt-damp"
              />
            </div>
          </div>

          {stainIds.map((id) => (
            <Callout key={id} id={id} {...geometry.stainPoints[id][0]} />
          ))}

          <div
            data-foam
            data-story-hidden
            className="absolute -inset-[15%] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgb(255 255 255 / 0.95), rgb(230 248 247 / 0.6) 45%, transparent 75%)",
            }}
          />
          <div data-steam data-story-hidden className="steam-band" />
        </div>
      </div>
    </div>
  );
}

/**
 * A wet state: base + stain overlay (opacity from the stage's --wash-stain),
 * fitted to the dirty shirt's size and centre so the handovers line up.
 */
function WashLayer({ id, state, glints }: { id: string; state: WashStateId; glints: number[] }) {
  const { scale, offsetX, offsetY } = geometry.washFit[state];
  const layers = assets.wash[state];
  return (
    <div data-shirt={id} data-story-hidden className="absolute inset-0">
      <div
        className="shirt-layer"
        style={{ transform: `translate(${offsetX * 100}%, ${offsetY * 100}%) scale(${scale})` }}
      >
        <Image
          {...layers.base}
          alt={id === "unfold" ? "" : layers.base.alt}
          sizes={SHIRT_SIZES}
          quality={90}
          loading="eager"
          fetchPriority="low"
          className="shirt-layer"
        />
        <Image
          {...layers.stains}
          alt=""
          sizes={SHIRT_SIZES}
          quality={90}
          loading="eager"
          fetchPriority="low"
          className="shirt-layer wash-stains"
        />
        {glints.map((i) => {
          const p = geometry.washStainPoints[state][i];
          return <Glint key={i} id={id} x={p.x} y={p.y} />;
        })}
      </div>
    </div>
  );
}

function Glint({ id, x, y }: { id: string; x: number; y: number }) {
  return (
    <svg
      data-glint={id}
      data-story-hidden
      viewBox="0 0 24 24"
      className="absolute size-[5%] -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
    >
      <path
        d="M12 0c.9 6.6 4.5 10.6 12 12-7.5 1.4-11.1 5.4-12 12-.9-6.6-4.5-10.6-12-12C7.5 10.6 11.1 6.6 12 0Z"
        fill="#69f9b7"
      />
    </svg>
  );
}

/** Hairline callout, no box: a dot on the stain, a rule out to one word. */
function Callout({ id, x, y }: { id: StainId; x: number; y: number }) {
  const leftward = x < 0.5;
  return (
    <div
      data-callout={id}
      data-story-hidden
      className="absolute flex items-center gap-2"
      style={{
        top: `${y * 100}%`,
        ...(leftward ? { right: `${(1 - x) * 100}%` } : { left: `${x * 100}%` }),
        flexDirection: leftward ? "row-reverse" : "row",
        translate: `${leftward ? "3px" : "-3px"} -50%`,
      }}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-ink" />
      <span className="h-px w-[clamp(28px,5cqw,72px)] bg-ink/70" />
      <span className="callout-label text-ink">{stainLabels[id]}</span>
    </div>
  );
}
