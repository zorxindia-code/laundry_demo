import type { ReactNode } from "react";
import type { CopySide } from "@/content/story";

type Props = {
  id: string;
  side: CopySide;
  onDark?: boolean;
  /** Vertical placement on desktop; phones and portrait tablets sit under the shirt. */
  align?: "center" | "bottom";
  hidden?: boolean;
  /** Wider measure for the opening headline. */
  wide?: boolean;
  children: ReactNode;
};

/**
 * Positions one block of scene copy on the side opposite the shirt. The outer
 * box handles layout; the inner article is what the timeline fades.
 */
export function SceneCopy({ id, side, onDark, align = "center", hidden = true, wide, children }: Props) {
  const column = side === "left" ? "lg:left-[7cqw] lg:right-auto" : "lg:right-[6cqw] lg:left-auto";
  const vertical =
    align === "center" ? "lg:inset-y-0 lg:flex lg:items-center lg:pb-0" : "lg:pb-[8cqh]";
  return (
    <div
      className={`story-copy pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-[7cqh] lg:px-0 ${column} ${vertical}`}
    >
      <article
        data-copy={id}
        data-side={side}
        data-story-hidden={hidden || undefined}
        className={`pointer-events-auto ${wide ? "max-w-[24rem] lg:max-w-[38rem]" : "max-w-[24rem]"} ${onDark ? "copy-on-dark" : "text-ink"}`}
      >
        {children}
      </article>
    </div>
  );
}

export function CopyTag({ children }: { children: ReactNode }) {
  return <p className="tag copy-tag mb-3">{children}</p>;
}

export function CopyHeadline({ children, as: As = "h2" }: { children: ReactNode; as?: "h1" | "h2" }) {
  return (
    <As
      className="font-serif text-[clamp(2.1rem,4.2vw,4rem)] leading-[1.02] font-medium tracking-[-0.02em] text-balance"
      style={{ fontVariationSettings: '"opsz" 96, "SOFT" 40' }}
    >
      {children}
    </As>
  );
}

export function CopyBody({ children }: { children: ReactNode }) {
  return <p className="copy-body mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed lg:text-lg">{children}</p>;
}
