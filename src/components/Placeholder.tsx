import type { Fact } from "@/content/site";

/** Renders a business fact, visibly marked when the client hasn't confirmed it. */
export function FactText({ fact }: { fact: Fact }) {
  if (fact.confirmed) return <>{fact.value}</>;
  return (
    <span className="placeholder" title="Placeholder: replace in src/content/site.ts">
      {fact.value}
    </span>
  );
}
