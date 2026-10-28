/**
 * Business facts. Anything with `confirmed: false` renders with a visible
 * placeholder marker until the client supplies the real value.
 */

export type Fact = { value: string; confirmed: boolean };

const tbc = (value: string): Fact => ({ value, confirmed: false });

export const site = {
  /** "The Clean Thread" is the creative working title, not a company name. */
  brand: tbc("The Clean Thread"),
  tagline: "Premium laundry, picked up and returned.",
  description:
    "Premium laundry, dry cleaning and pressing, collected from your door and returned fresh.",
  /** From the creative direction; not yet a confirmed service promise. */
  turnaround: tbc("48 hours"),
  contact: {
    phone: tbc("Phone number"),
    whatsapp: tbc("WhatsApp number"),
    email: tbc("Email address"),
    address: tbc("Studio address"),
    hours: tbc("Opening hours"),
  },
  serviceAreas: tbc("Service areas to be confirmed"),
  /**
   * Where Book a Pickup sends people. Set NEXT_PUBLIC_BOOKING_URL to a real
   * booking page; without it the form says plainly that booking is not live.
   */
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || null,
} as const;

export const nav = [
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "How it works", href: "#how-it-works" },
] as const;

export const proof = {
  stats: [
    { label: "Garments cleaned", value: tbc("—") },
    { label: "Average rating", value: tbc("—") },
    { label: "Returned on time", value: tbc("—") },
  ],
  guarantees: [tbc("Damage protection"), tbc("Eco-friendly detergents"), tbc("48h turnaround")],
} as const;
