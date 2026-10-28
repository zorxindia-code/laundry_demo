import Image from "next/image";
import { assets } from "@/lib/assets/manifest";

const MACHINE_SIZES = "(max-width: 1023px) 118vw, 78vw";

/**
 * Two copies of the approved machine still share one transform. The back copy
 * is the whole machine; the front copy is masked to rim and body only and is
 * shown while the shirt is "inside", so the glass reads as being in front of
 * it. This is layering on a flat image, not a 3D camera move.
 */
export function MachineBack() {
  return (
    <div data-machine="back" data-story-hidden className="machine-rig">
      <Image
        {...assets.washingMachine}
        alt={assets.washingMachine.alt}
        sizes={MACHINE_SIZES}
        loading="eager"
        fetchPriority="low"
        className="h-full w-full"
      />
    </div>
  );
}

export function MachineFront() {
  return (
    <div data-machine="front" data-story-hidden className="machine-rig">
      <Image
        {...assets.washingMachine}
        alt=""
        sizes={MACHINE_SIZES}
        loading="eager"
        fetchPriority="low"
        className="machine-front h-full w-full"
      />
      <div className="glass-sheen" />
    </div>
  );
}

/**
 * Inside the drum: clipped to the porthole, filling the screen once we're
 * through. Bubbles and spray come from the wet-shirt stills themselves.
 */
export function DrumInterior() {
  return (
    <div className="stage-layer drum">
      <div className="drum-base" />
      <div className="drum-spin">
        <div className="drum-water" />
        <div className="drum-perforations" />
      </div>
      <p
        data-word="clean"
        className="giant-word giant-clean inset-x-0 text-center"
        aria-hidden
      >
        {"CLEAN".split("").map((l, i) => (
          <span key={i} data-letter className="inline-block">
            {l}
          </span>
        ))}
      </p>
      <div data-caustics className="drum-caustics" />
    </div>
  );
}
