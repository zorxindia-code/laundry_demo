import { nav, site } from "@/content/site";

/** Fixed and transparent; the story timeline retints it inside the drum. */
export function Header() {
  return (
    <header
      data-site-header
      className="site-header fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-6 px-5 py-4 md:px-10 md:py-6"
    >
      <a
        href="#top"
        className="font-serif text-xl font-semibold tracking-tight md:text-2xl"
        style={{ fontVariationSettings: '"opsz" 72' }}
      >
        {site.brand.value}
        <span className="sr-only"> (working title)</span>
      </a>
      <nav aria-label="Primary" className="hidden md:block">
        <ul className="flex gap-9 text-[0.9375rem] font-medium">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-link">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <a href="#book" className="cta-pill">
        Book a Pickup
      </a>
    </header>
  );
}
