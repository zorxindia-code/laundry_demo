import { proof } from "@/content/site";
import { FactText } from "@/components/Placeholder";

/**
 * Trust signals. Every figure is a placeholder until real numbers exist, and
 * there are no testimonials until real customers give them.
 */
export function Proof() {
  return (
    <section aria-labelledby="proof-title" className="px-5 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <h2 id="proof-title" className="tag copy-tag mb-12">
          Proof, in numbers
        </h2>
        <dl className="grid gap-12 md:grid-cols-3 md:gap-8">
          {proof.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse">
              <dt className="mt-3 text-ink/70">{stat.label}</dt>
              <dd
                className="font-serif text-[clamp(4rem,9vw,8rem)] leading-none font-semibold tracking-[-0.03em]"
                style={{ fontVariationSettings: '"opsz" 144' }}
              >
                <FactText fact={stat.value} />
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-16 max-w-[40ch] font-serif text-xl text-ink/60 italic">
          Customer stories will appear here once they&rsquo;ve been collected.
        </p>
        <ul className="mt-16 flex flex-wrap gap-x-10 gap-y-3 border-t border-ink/15 pt-8 text-sm font-medium">
          {proof.guarantees.map((g) => (
            <li key={g.value} className="flex items-center gap-2">
              <svg aria-hidden viewBox="0 0 16 16" className="size-4 text-teal-ink">
                <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <FactText fact={g} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
