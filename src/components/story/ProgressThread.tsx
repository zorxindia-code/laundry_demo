import { scenes } from "@/lib/animation/scenes";

/** The thread down the right edge: wash-cycle progress, scenes 01–08. */
export function ProgressThread() {
  return (
    <div
      aria-hidden
      className="story-visual-only pointer-events-none absolute top-1/2 right-[2.2cqw] flex h-[52cqh] -translate-y-1/2 items-stretch gap-3 max-lg:right-2 max-lg:h-[40cqh]"
    >
      <ol className="hidden flex-col justify-between text-right font-sans text-[0.6875rem] font-semibold tracking-[0.12em] text-teal tabular-nums lg:flex">
        {scenes.map((s) => (
          <li key={s.n} data-thread-step className="opacity-35">
            {s.n}
          </li>
        ))}
      </ol>
      <div className="thread-track relative w-px">
        <div data-thread-fill className="thread-fill absolute inset-0" />
      </div>
    </div>
  );
}
