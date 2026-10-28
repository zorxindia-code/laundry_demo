"""
Cut the wet-shirt references (lit on pure black, no alpha) into transparent
layers for the wash scene, and key their brown stains into separate overlays.

  python3 scripts/cutout-wash-states.py assets/reference/wash-open.png public/images/story/wash/open
  python3 scripts/cutout-wash-states.py assets/reference/wash-compact.png public/images/story/wash/compact

writes <out>-base.png (garment + water, stains inpainted) and
<out>-stains.png (overlay; stacked on the base it recombines to the original),
and prints the garment's bounding box for src/lib/assets/manifest.ts.

Needs numpy, scipy and Pillow. The references themselves are never modified.

Matting: a subject lit on black is already "premultiplied over black", so the
colour is alpha × true colour and only alpha has to be solved.
  - Garment: large bright connected regions, closed and hole-filled, made
    fully opaque so fold shadows stay dark instead of turning see-through.
    Only near-black gaps inside it (real background between sleeves) drop out.
  - Water, foam, droplets: luminance alpha, so highlights stay and dark spray
    falls away; colour is recovered as C / alpha.
"""

import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

FABRIC_LUMA = 0.32  # fabric core; spray filaments are thinner than OPEN_R
OPEN_R = 5
CLOSE_R = 12
KEEP_RATIO = 0.04  # keep components at least this share of the largest
GAP_LO, GAP_HI = 0.012, 0.06  # near-black inside the garment → transparent
SPRAY_FLOOR = 0.02

# Warmth (r - b): fabric under this cool light sits at -0.07…-0.02, stains
# at +0.05…+0.19, so the key starts just above the fabric's 90th percentile.
STAIN_START, STAIN_RANGE = -0.015, 0.09
INPAINT_SIGMA = 7


def disk(r):
    y, x = np.ogrid[-r : r + 1, -r : r + 1]
    return x * x + y * y <= r * r


def luma(c):
    # Explicit sum: matmul on numpy 2.0 + Accelerate can emit bogus NaNs.
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]


def smoothstep(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def garment_mask(rgb):
    core = ndi.binary_opening(luma(rgb) > FABRIC_LUMA, structure=disk(OPEN_R))
    labels, n = ndi.label(core)
    if n == 0:
        raise SystemExit("no garment found")
    sizes = ndi.sum(core, labels, index=np.arange(1, n + 1))
    keep = np.isin(labels, 1 + np.flatnonzero(sizes >= sizes.max() * KEEP_RATIO))
    keep = ndi.binary_closing(keep, structure=disk(CLOSE_R))
    keep = ndi.binary_fill_holes(keep)
    # The solid region stops short of the silhouette: anti-aliased edge pixels
    # are part black and would read as a dark fringe if kept opaque, so the
    # last few pixels fall back to the luminance alpha.
    solid = ndi.binary_erosion(keep, structure=disk(3))
    return ndi.gaussian_filter(solid.astype(float), 1.2), keep


def matte(rgb):
    soft, hard = garment_mask(rgb)
    lum_max = rgb.max(axis=2)
    alpha_garment = smoothstep(lum_max, GAP_LO, GAP_HI)
    alpha_spray = np.clip((lum_max - SPRAY_FLOOR) / (1 - SPRAY_FLOOR), 0, 1)
    alpha = np.maximum(soft * alpha_garment, alpha_spray)
    colour = np.where(alpha[..., None] > 1e-3, rgb / np.maximum(alpha[..., None], 1e-3), 0)
    return np.clip(colour, 0, 1), alpha, hard


def split_stains(colour, alpha, hard):
    """Warm stains on cool fabric → (stain-free base colour, overlay colour, overlay alpha)."""
    warmth = colour[..., 0] - colour[..., 2]
    s = np.clip((warmth - STAIN_START) / STAIN_RANGE, 0, 1) * hard
    s = ndi.gaussian_filter(ndi.maximum_filter(s, size=3), 1)
    # Normalised convolution: average nearby clean fabric into the stains.
    w = (1 - s) * alpha * hard
    num = np.stack([ndi.gaussian_filter(colour[..., i] * w, INPAINT_SIGMA) for i in range(3)], axis=2)
    den = ndi.gaussian_filter(w, INPAINT_SIGMA)[..., None]
    fill = np.where(den > 1e-3, num / np.maximum(den, 1e-3), colour)
    # Keep the original's light and shade; only the hue goes.
    fill = np.clip(fill + (np.maximum(luma(colour), luma(fill) * 0.97) - luma(fill))[..., None], 0, 1)
    base = colour * (1 - s[..., None]) + fill * s[..., None]
    # Overlay alpha k and colour L so that k*L + (1-k)*base == original.
    with np.errstate(divide="ignore", invalid="ignore"):
        k = np.maximum(s, np.max(np.where(base > 0, (base - colour) / base, 0), axis=2))
        k = np.clip(k, 0, 1)
        over = np.where(k[..., None] > 1e-3, (colour - (1 - k[..., None]) * base) / k[..., None], 0)
    return base, np.clip(over, 0, 1), k


def save(path, colour, alpha):
    rgba = np.dstack([colour, alpha])
    Image.fromarray(np.round(rgba * 255).astype(np.uint8)).save(path, optimize=True)


def main(src, out):
    rgb = np.asarray(Image.open(src).convert("RGB"), dtype=float) / 255
    colour, alpha, hard = matte(rgb)
    base, over, k = split_stains(colour, alpha, hard)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    save(f"{out}-base.png", base, alpha)
    save(f"{out}-stains.png", over, k * alpha)
    h, w = hard.shape
    ys, xs = np.nonzero(hard)
    print(
        f"{out}: canvas {w}x{h}, garment bbox x {xs.min()}-{xs.max()} y {ys.min()}-{ys.max()}, "
        f"centre ({xs.mean():.0f}, {ys.mean():.0f}), stain px {(k > 0.1).sum()}"
    )


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
