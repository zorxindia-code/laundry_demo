"use client";

import { useId, useState, type FormEvent } from "react";

/**
 * Area field + Book a Pickup. With a booking URL configured it hands the area
 * over as `?area=`; without one it says plainly that nothing was sent.
 */
export function BookingForm({ bookingUrl }: { bookingUrl: string | null }) {
  const id = useId();
  const [notice, setNotice] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    if (bookingUrl) return; // native GET submit to the booking page
    e.preventDefault();
    setNotice(
      "Online booking isn't connected yet, so nothing was sent. This preview needs a booking link (NEXT_PUBLIC_BOOKING_URL).",
    );
  }

  return (
    <form action={bookingUrl ?? undefined} method="get" onSubmit={onSubmit} className="mt-10 w-full max-w-xl">
      <label htmlFor={id} className="sr-only">
        Your area or postcode
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:bg-paper sm:p-1.5 sm:shadow-[0_1px_0_rgb(6_46_61/0.08),0_12px_32px_-16px_rgb(6_46_61/0.35)]">
        <input
          id={id}
          name="area"
          required
          autoComplete="postal-code"
          placeholder="Your area or postcode"
          className="min-w-0 flex-1 rounded-full bg-paper px-5 py-3.5 text-base text-ink placeholder:text-ink/45 focus-visible:outline-offset-0 sm:bg-transparent"
        />
        <button type="submit" className="cta-pill justify-center">
          Book a Pickup
        </button>
      </div>
      <p role="status" className="mt-4 min-h-[1.5em] text-sm text-ink/75">
        {notice}
      </p>
    </form>
  );
}
