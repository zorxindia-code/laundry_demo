"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { buildReducedTimeline, buildStoryTimeline } from "@/lib/animation/buildTimeline";
import { sceneCopy } from "@/content/story";
import { site } from "@/content/site";
import { FactText } from "@/components/Placeholder";
import { ShirtRig } from "./ShirtRig";
import { DrumInterior, MachineBack, MachineFront } from "./Machine";
import { ProgressThread } from "./ProgressThread";
import { CopyBody, CopyHeadline, CopyTag, SceneCopy } from "./SceneCopy";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The pinned film. The section is 600–900svh tall and the stage inside it is
 * sticky (CSS pinning, so React keeps ownership of the DOM); one ScrollTrigger
 * scrubs one master timeline across the section's full height.
 */
export function StoryStage() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!section.current || !stage.current) return;
      ScrollTrigger.config({ ignoreMobileResize: true });
      const header = document.querySelector<HTMLElement>("[data-site-header]");

      const mm = gsap.matchMedia(section.current);
      mm.add(
        // matchMedia only runs when some condition matches, so name all three.
        {
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop = false, reduce = false } = ctx.conditions ?? {};
          const tl = gsap.timeline({
            defaults: { ease: "none", lazy: false },
            scrollTrigger: {
              trigger: section.current,
              start: "top top",
              end: "bottom bottom",
              // A short lag turns trackpad jitter into glide.
              scrub: reduce ? true : 0.8,
            },
          });
          const targets = { stage: stage.current!, header };
          if (reduce) buildReducedTimeline(tl, targets, { desktop });
          else buildStoryTimeline(tl, targets, { desktop });
        },
      );
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      id="top"
      aria-label="The Clean Thread: one shirt through the wash cycle"
      className="story-section relative h-[600svh] lg:h-[900svh]"
    >
      <div ref={stage} className="story-stage sticky top-0 h-svh w-full overflow-hidden">
        <div aria-hidden className="story-visual-only stage-layer">
          <p
            data-word="dirty"
            className="giant-word giant-dirty"
          >
            DIRTY
          </p>
          <p
            data-word="fresh"
            className="giant-word giant-fresh"
          >
            {"FRESH".split("").map((l, i) => (
              <span key={i} data-letter data-story-hidden className="inline-block">
                {l}
              </span>
            ))}
          </p>
          <div data-floor-shadow className="floor-shadow" />
          <MachineBack />
          <DrumInterior />
          <ShirtRig />
          <MachineFront />
        </div>

        <SceneCopy id="s01" side="left" align="bottom" hidden={false} wide>
          <p className="tag copy-tag mb-3">
            <FactText fact={site.brand} />
          </p>
          <CopyHeadline as="h1">{site.tagline}</CopyHeadline>
          <p className="mt-8 flex items-center gap-3 text-sm font-medium text-ink/70">
            <span aria-hidden className="block h-10 w-px bg-teal" />
            Scroll to start the cycle
          </p>
        </SceneCopy>

        {sceneCopy.map((c) => (
          <SceneCopy key={c.id} id={c.id} side={c.side} onDark={c.onDark}>
            {c.tag && <CopyTag>{c.tag}</CopyTag>}
            {c.headline ? <CopyHeadline>{c.headline}</CopyHeadline> : null}
            {c.body && (c.headline ? <CopyBody>{c.body}</CopyBody> : <SoloBody>{c.body}</SoloBody>)}
          </SceneCopy>
        ))}

        <SceneCopy id="s08" side="right" align="bottom">
          <p
            className="font-serif text-[clamp(1.75rem,2.8vw,2.6rem)] leading-[1.08] font-medium tracking-[-0.015em] text-balance"
            style={{ fontVariationSettings: '"opsz" 96, "SOFT" 40' }}
          >
            Fresh and clean, back at your door in <FactText fact={site.turnaround} />.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <a href="#book" className="cta-pill">
              Book a Pickup
            </a>
            <a href="#pricing" className="text-link font-medium">
              See pricing
            </a>
          </div>
        </SceneCopy>

        <ProgressThread />
      </div>
    </section>
  );
}

/** Wash-scene copy has no headline: the service line itself carries it. */
function SoloBody({ children }: { children: ReactNode }) {
  return (
    <p
      className="font-serif text-[clamp(1.6rem,2.6vw,2.5rem)] leading-[1.12] tracking-[-0.01em] text-balance"
      style={{ fontVariationSettings: '"opsz" 72, "SOFT" 40' }}
    >
      {children}
    </p>
  );
}
