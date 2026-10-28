import type { ReactNode } from "react";
import { site } from "@/content/site";
import { FactText } from "@/components/Placeholder";

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.25, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const steps: { title: string; detail: ReactNode; icon: ReactNode }[] = [
  {
    title: "Book",
    detail: "Pick a collection slot that suits you.",
    icon: (
      <svg viewBox="0 0 32 32" {...stroke}>
        <rect x="5" y="7" width="22" height="20" rx="2" />
        <path d="M5 13h22M11 4v6M21 4v6M11 19l3 3 6-6" />
      </svg>
    ),
  },
  {
    title: "We collect",
    detail: "Picked up from your door.",
    icon: (
      <svg viewBox="0 0 32 32" {...stroke}>
        <path d="M3 9h16v13H3zM19 13h6l4 5v4h-10z" />
        <circle cx="9" cy="24" r="2.5" />
        <circle cx="23" cy="24" r="2.5" />
      </svg>
    ),
  },
  {
    title: "We clean",
    detail: (
      <>
        Sorted, treated and washed. Back in <FactText fact={site.turnaround} />.
      </>
    ),
    icon: (
      <svg viewBox="0 0 32 32" {...stroke}>
        <rect x="6" y="3" width="20" height="26" rx="2" />
        <circle cx="16" cy="17" r="7" />
        <path d="M10 7h3M12 17c2-2 4 2 8 0" />
      </svg>
    ),
  },
  {
    title: "We return",
    detail: "Pressed, folded, on hangers.",
    icon: (
      <svg viewBox="0 0 32 32" {...stroke}>
        <path d="M16 6a2.5 2.5 0 1 1 2.5 2.5c-1.4 0-2.5 1-2.5 2.3V12L4 22h24L16 12" />
      </svg>
    ),
  },
];

/** Four steps on one line, the thread continuing as the connecting rule. */
export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-24 px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <p className="tag copy-tag mb-4">How it works</p>
        <h2
          id="how-title"
          className="max-w-[16ch] font-serif text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.02] font-medium tracking-[-0.02em]"
        >
          Four steps, one thread.
        </h2>
        <ol className="relative mt-16 grid gap-12 md:mt-24 md:grid-cols-4 md:gap-8">
          <span aria-hidden className="absolute top-[22px] right-0 left-0 hidden h-px bg-teal md:block" />
          <span aria-hidden className="absolute top-0 bottom-0 left-[22px] w-px bg-teal md:hidden" />
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-6 md:block">
              <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full bg-canvas text-ink">
                <span className="block size-7">{step.icon}</span>
              </span>
              <div className="md:mt-8">
                <p className="text-xs font-semibold tracking-[0.14em] text-teal-ink tabular-nums">0{i + 1}</p>
                <h3 className="mt-2 font-serif text-2xl font-medium">{step.title}</h3>
                <p className="mt-2 max-w-[24ch] text-ink/75">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
