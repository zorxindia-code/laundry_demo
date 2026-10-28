# The Clean Thread

A scroll-driven website for a premium laundry service. One shirt goes through the whole wash cycle as you scroll. It's built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4 and GSAP ScrollTrigger.

- Creative brief: [docs/creative-direction.md](docs/creative-direction.md)
- How it's built, the asset status and known gaps: [docs/architecture.md](docs/architecture.md)

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
npm run lint
npx tsc --noEmit   # run after a build: Next generates route types
```

## Configure

- `NEXT_PUBLIC_BOOKING_URL`: where **Book a Pickup** sends people, with the area passed as `?area=`. If it's unset, the form says that online booking isn't connected and sends nothing.
- `src/content/site.ts`: brand name (the current name is a working title), turnaround, contact details, hours, service areas, stats and guarantees. Each value stays visibly marked as a placeholder until `confirmed: true`.
- `src/content/services.ts`: service list and prices. Prices show as placeholders until an `amount` is set.

## Assets

The approved stills are in `public/images/story/`. The stain layers in `derived/` are generated from `dirty-shirt.png`:

```bash
python3 scripts/derive-stain-layers.py public/images/story/dirty-shirt.png   # needs Pillow
```

The wet-shirt states for the wash are cut out from the untouched references in `assets/reference/`:

```bash
python3 scripts/cutout-wash-states.py assets/reference/wash-open.png public/images/story/wash/open        # needs numpy, scipy, Pillow
python3 scripts/cutout-wash-states.py assets/reference/wash-compact.png public/images/story/wash/compact
```
# laundry_demo
