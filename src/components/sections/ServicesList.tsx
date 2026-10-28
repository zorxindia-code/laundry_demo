import { services } from "@/content/services";
import type { Price } from "@/content/price";

function PriceText({ price }: { price: Price }) {
  if (price.amount === null) {
    return (
      <span className="placeholder" title="Placeholder: pricing to be supplied in src/content/services.ts">
        from {price.currency} —
      </span>
    );
  }
  return (
    <>
      from {price.currency}
      {price.amount.toLocaleString("en-IN")}
    </>
  );
}

/** Editorial list, not a card grid: name, one line, price, hairlines between. */
export function ServicesList() {
  return (
    <section id="services" aria-labelledby="services-title" className="scroll-mt-24 px-5 py-28 md:px-10 md:py-36">
      <div id="pricing" className="mx-auto max-w-6xl scroll-mt-24">
        <p className="tag copy-tag mb-4">Services &amp; pricing</p>
        <h2
          id="services-title"
          className="max-w-[18ch] font-serif text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.02] font-medium tracking-[-0.02em]"
        >
          Everything the shirt went through.
        </h2>
        <ul className="mt-14 border-t border-ink/15 md:mt-20">
          {services.map((s) => (
            <li
              key={s.id}
              className="grid gap-1 border-b border-ink/15 py-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto] md:items-baseline md:gap-8 md:py-8"
            >
              <h3
                className="font-serif text-[1.75rem] leading-tight font-medium md:text-[2.1rem]"
                style={{ fontVariationSettings: '"opsz" 72' }}
              >
                {s.name}
              </h3>
              <p className="text-ink/75 md:text-lg">{s.summary}</p>
              <p className="mt-2 font-medium tabular-nums md:mt-0 md:text-right">
                <PriceText price={s.price} />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
