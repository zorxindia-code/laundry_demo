import Image from "next/image";
import { assets } from "@/lib/assets/manifest";
import { site } from "@/content/site";
import { BookingForm } from "./BookingForm";

/** The clean shirt returns, small and floating, above the booking field. */
export function FinalCta() {
  return (
    <section id="book" aria-labelledby="book-title" className="scroll-mt-16 px-5 pt-16 pb-32 md:px-10 md:pb-40">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="final-float w-[min(56vw,240px)]">
          <Image {...assets.cleanShirt} alt="" sizes="240px" quality={90} className="h-auto w-full" />
        </div>
        <div
          aria-hidden
          className="-mt-2 h-3 w-36 rounded-[50%] bg-[radial-gradient(closest-side,rgb(6_46_61/0.2),transparent)] blur-[3px]"
        />
        <h2
          id="book-title"
          className="mt-10 font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.02] font-medium tracking-[-0.02em]"
          style={{ fontVariationSettings: '"opsz" 120, "SOFT" 40' }}
        >
          Your next load, handled.
        </h2>
        <BookingForm bookingUrl={site.bookingUrl} />
      </div>
    </section>
  );
}
