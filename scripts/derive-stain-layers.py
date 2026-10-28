"""
Derive separate stain layers from the approved dirty-shirt asset.

The brief needs stains that reveal (scene 02) and fade one group at a time
(scene 05), but `dirty-shirt.png` has them baked in. This script keys the warm
stain hue out of the image (fabric is neutral grey/white, stains are brown) and
writes:

  derived/dirty-shirt-base.png   the same shirt, same pose, stains inpainted
  derived/stain-<group>.png      one transparent overlay per stain group

Stacking every overlay at full opacity on the base reproduces the original.
Nothing is redrawn: every pixel comes from the approved asset. Replace this
whole step with render-pass stain masks once the 3D shirt exists.

Usage (dev only, needs Pillow):
  python3 scripts/derive-stain-layers.py public/images/story/dirty-shirt.png
"""

import os
import sys

from PIL import Image, ImageFilter

# Warmth (r - b) above STAIN_START starts counting as stain; full at +STAIN_RANGE.
STAIN_START = 5
STAIN_RANGE = 22
BLUR_RADIUS = 7

# Stain groups as boxes in source-image pixels (818 x 782); first match wins.
GROUPS = [
    ("collar", (300, 40, 540, 190)),
    ("coffee", (300, 190, 620, 375)),
    ("cuffs", (0, 0, 300, 782)),
    ("cuffs", (590, 0, 818, 782)),
    ("smudges", (0, 0, 818, 782)),
]

# Buttons are warm-toned too; keep them out of the stain key.
BUTTONS = [(408, 218, 9), (406, 296, 9), (406, 376, 9), (407, 452, 9), (410, 532, 9), (430, 612, 10)]


def group_of(x, y):
    for name, (x0, y0, x1, y1) in GROUPS:
        if x0 <= x < x1 and y0 <= y < y1:
            return name
    return "smudges"


def on_button(x, y):
    return any((x - bx) ** 2 + (y - by) ** 2 <= br * br for bx, by, br in BUTTONS)


def main(src):
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    px = im.load()

    strength = Image.new("L", (w, h))
    sp = strength.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0 or on_button(x, y):
                continue
            s = (r - b - STAIN_START) / STAIN_RANGE
            sp[x, y] = int(255 * min(1.0, max(0.0, s)))
    # Grow the key slightly so stain halos are caught too.
    strength = strength.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1))
    sp = strength.load()

    # Normalised convolution: average neighbouring clean fabric to fill stains.
    weight = Image.new("L", (w, h))
    wp = weight.load()
    chans = [Image.new("L", (w, h)) for _ in range(3)]
    cps = [c.load() for c in chans]
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            wt = (1 - sp[x, y] / 255) * (a / 255)
            wp[x, y] = int(255 * wt)
            for i, v in enumerate((r, g, b)):
                cps[i][x, y] = int(v * wt)
    blur = ImageFilter.GaussianBlur(BLUR_RADIUS)
    weight_b = weight.filter(blur).load()
    chans_b = [c.filter(blur).load() for c in chans]

    base = im.copy()
    bp = base.load()
    layers = {}
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            s = sp[x, y] / 255
            if a == 0 or s <= 0.01:
                continue
            wb = weight_b[x, y]
            if wb < 3:
                continue
            clean = [chans_b[i][x, y] * 255 / wb for i in range(3)]
            # Keep the original's luminance variation (folds) but neutralise hue.
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            clum = 0.299 * clean[0] + 0.587 * clean[1] + 0.114 * clean[2]
            lift = max(lum, clum * 0.97) - clum
            c = [min(255, v + lift) for v in clean]
            bp[x, y] = (round(c[0]), round(c[1]), round(c[2]), a)
            # Overlay colour L and alpha k so that k*L + (1-k)*C == original;
            # k grows past s where the stain is darker than s alone can reach.
            o = (r, g, b)
            k = max([s] + [(c[i] - o[i]) / c[i] for i in range(3) if c[i] > 0])
            k = min(1.0, k)
            col = tuple(round(min(255, max(0, (o[i] - (1 - k) * c[i]) / k))) for i in range(3))
            name = group_of(x, y)
            layer = layers.get(name)
            if layer is None:
                layer = layers[name] = Image.new("RGBA", (w, h))
            layer.putpixel((x, y), col + (round(255 * k * a / 255),))

    out = os.path.join(os.path.dirname(src), "derived")
    os.makedirs(out, exist_ok=True)
    base.save(os.path.join(out, "dirty-shirt-base.png"), optimize=True)
    for name, layer in layers.items():
        layer.save(os.path.join(out, f"stain-{name}.png"), optimize=True)
    print("wrote", out, sorted(layers))


if __name__ == "__main__":
    main(sys.argv[1])
