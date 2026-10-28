import type { ReactNode } from "react";
import { nav, site } from "@/content/site";
import { FactText } from "@/components/Placeholder";

/** The only full deep-teal block: the inside of the drum, bookending the page. */
export function Footer() {
  const { contact } = site;
  return (
    <footer className="bg-ink px-5 pt-20 pb-10 text-paper md:px-10 md:pt-28">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-serif text-3xl font-medium" style={{ fontVariationSettings: '"opsz" 72' }}>
            <FactText fact={site.brand} />
          </p>
          <p className="mt-4 max-w-[30ch] text-paper/70">{site.tagline}</p>
        </div>
        <FooterColumn title="Visit">
          <li>
            <FactText fact={contact.address} />
          </li>
          <li>
            <FactText fact={contact.hours} />
          </li>
          <li>
            <FactText fact={site.serviceAreas} />
          </li>
        </FooterColumn>
        <FooterColumn title="Contact">
          <li>
            <FactText fact={contact.phone} />
          </li>
          <li>
            <FactText fact={contact.whatsapp} />
          </li>
          <li>
            <FactText fact={contact.email} />
          </li>
        </FooterColumn>
        <FooterColumn title="Explore">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-link">
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#book" className="text-link">
              Book a Pickup
            </a>
          </li>
        </FooterColumn>
      </div>
      <div className="mx-auto mt-20 flex max-w-6xl flex-wrap justify-between gap-4 border-t border-paper/15 pt-6 text-sm text-paper/60">
        <p>
          © <FactText fact={site.brand} />
        </p>
        <p>
          <span className="placeholder" title="Placeholder: legal pages to be supplied">
            Privacy · Terms
          </span>
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="tag mb-4 text-water">{title}</h2>
      <ul className="space-y-2.5 text-paper/80">{children}</ul>
    </div>
  );
}
