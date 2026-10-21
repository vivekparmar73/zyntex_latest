"""Recolour the wooden hangers in resources/racks/rack*.png to black.

The hanger is found as the largest connected blob of wood-coloured pixels near the top of
each image, then grown by a couple of pixels to catch its anti-aliased edge. Isolated
wood-like specks in the fabric or neck labels are left alone. The metal hook is untouched.

Output: resources/racks/black/rack*.png (the originals are not modified).
Run: python scripts/blacken-hangers.py
"""
import colorsys
import os
from collections import deque

from PIL import Image

SRC = os.path.join('resources', 'racks')
OUT = os.path.join(SRC, 'black')
SEARCH_ROWS = 64  # how far below the hook top the hanger can reach


def hsv(p):
    return colorsys.rgb_to_hsv(p[0] / 255, p[1] / 255, p[2] / 255)


def strict_wood(p):
    h, s, v = hsv(p)
    return p[3] > 120 and 0.045 <= h <= 0.12 and 0.2 <= s <= 0.68 and v >= 0.5


def loose_wood(p):
    h, s, v = hsv(p)
    return p[3] > 10 and 0.0 <= h <= 0.16 and s >= 0.12 and v >= 0.25


def process(name):
    im = Image.open(os.path.join(SRC, name)).convert('RGBA')
    px = im.load()
    left, top, right, bottom = im.getbbox()
    y_end = min(bottom, top + SEARCH_ROWS)

    seeds = {(x, y) for y in range(top, y_end) for x in range(left, right) if strict_wood(px[x, y])}

    # connected components of the strict mask; keep the big ones (the hanger)
    hanger, seen = set(), set()
    for start in seeds:
        if start in seen:
            continue
        comp, queue = [], deque([start])
        seen.add(start)
        while queue:
            x, y = queue.popleft()
            comp.append((x, y))
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    n = (x + dx, y + dy)
                    if n in seeds and n not in seen:
                        seen.add(n)
                        queue.append(n)
        if len(comp) >= 60:
            hanger.update(comp)

    # grow two pixels into loosely wood-coloured neighbours (edges and shadows)
    for _ in range(2):
        grown = set()
        for x, y in hanger:
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    n = (x + dx, y + dy)
                    if n not in hanger and left <= n[0] < right and top <= n[1] < y_end and loose_wood(px[n]):
                        grown.add(n)
        hanger |= grown

    for x, y in hanger:
        r, g, b, a = px[x, y]
        _, _, v = hsv((r, g, b, a))
        c = int((0.05 + 0.24 * v ** 1.5) * 255)  # keep the shading, as a satin black
        px[x, y] = (c, c, min(255, int(c * 1.05)), a)

    im.save(os.path.join(OUT, name))
    return len(hanger)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for f in sorted(os.listdir(SRC)):
        if f.startswith('rack') and f.endswith('.png'):
            print(f, process(f), 'pixels recoloured')
