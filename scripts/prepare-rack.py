"""Prepare the clothing-rack photos in resources/racks/rack*.png for the website.

* Photos that already show a wooden hanger get it recoloured to black.
* Photos without a hanger (product cut-outs) get a black hanger drawn behind the
  garment, following its shoulder line, with a metal hook on top.
* Every garment is trimmed and scaled to the same shoulder width so the rack looks consistent.

Output: resources/racks/black/rack*.png (originals are never modified).
Then run `npm run images` to build the web versions.
Run: python scripts/prepare-rack.py
"""
import colorsys
import os
from collections import deque

from PIL import Image, ImageDraw, ImageFilter

SRC = os.path.join('resources', 'racks')
OUT = os.path.join(SRC, 'black')
SHOULDER = 150  # target shoulder width in px (output)
SS = 4  # supersampling for the drawn hanger


def hsv(p):
    return colorsys.rgb_to_hsv(p[0] / 255, p[1] / 255, p[2] / 255)


def strict_wood(p):
    h, s, v = hsv(p)
    return p[3] > 120 and 0.045 <= h <= 0.12 and 0.2 <= s <= 0.68 and v >= 0.5


def loose_wood(p):
    h, s, v = hsv(p)
    return p[3] > 10 and 0.0 <= h <= 0.16 and s >= 0.12 and v >= 0.25


def find_wood_hanger(im):
    """Largest wood-coloured blobs near the top of the image (the hanger), or an empty set."""
    px = im.load()
    left, top, right, bottom = im.getbbox()
    y_end = min(bottom, top + int((bottom - top) * 0.3))
    seeds = {(x, y) for y in range(top, y_end) for x in range(left, right) if strict_wood(px[x, y])}
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
    for _ in range(2):
        grown = set()
        for x, y in hanger:
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    n = (x + dx, y + dy)
                    if n not in hanger and left <= n[0] < right and top <= n[1] < y_end and loose_wood(px[n]):
                        grown.add(n)
        hanger |= grown
    return hanger


def blacken(im, pixels):
    px = im.load()
    for x, y in pixels:
        r, g, b, a = px[x, y]
        _, _, v = hsv((r, g, b, a))
        c = int((0.05 + 0.24 * v ** 1.5) * 255)  # keep the shading, as a satin black
        px[x, y] = (c, c, min(255, int(c * 1.05)), a)


def has_photo_hook(im):
    """True if the image starts with a narrow hook (a photo taken on a hanger) rather than fabric."""
    px = im.load()
    w, h = im.size
    xs = [x for y in range(max(1, int(h * 0.07))) for x in range(w) if px[x, y][3] > 100]
    return bool(xs) and (max(xs) - min(xs)) < w * 0.15


def widest_span(alpha, start=0.1, end=0.42):
    """Widest extent across the upper body (shoulders / sleeves) — used for consistent sizing."""
    w, h = alpha.size
    a = alpha.load()
    best = (0, w - 1)
    widest = -1
    for y in range(int(h * start), int(h * end), 2):
        xs = [x for x in range(w) if a[x, y] > 60]
        if xs and xs[-1] - xs[0] > widest:
            widest = xs[-1] - xs[0]
            best = (xs[0], xs[-1])
    return best


def shoulder_span(alpha, rows=(0.12, 0.2)):
    """Width of the garment a little below its top (where a hanger's arms would sit)."""
    w, h = alpha.size
    a = alpha.load()
    best = (w * 0.25, w * 0.75)
    widest = 0
    for f in rows:
        y = int(h * f)
        xs = [x for x in range(w) if a[x, y] > 60]
        if xs and xs[-1] - xs[0] > widest:
            widest = xs[-1] - xs[0]
            best = (xs[0], xs[-1])
    return best


def top_edge(alpha, x):
    a = alpha.load()
    for y in range(alpha.size[1]):
        if a[x, y] > 60:
            return y
    return alpha.size[1]


def add_hanger(garment):
    """Draws a black hanger behind a cut-out garment and returns the composite."""
    alpha = garment.getchannel('A')
    w, h = garment.size
    x0, x1 = widest_span(alpha, 0.1, 0.3)
    cx = (x0 + x1) / 2
    span = (x1 - x0) * 0.82

    # hanger arms end a little inside the shoulders, resting just above the fabric
    tip = span * 0.44
    lx, rx = int(cx - tip), int(cx + tip)
    ly = top_edge(alpha, max(0, lx)) - span * 0.012
    ry = top_edge(alpha, min(w - 1, rx)) - span * 0.012
    neck_top = min(top_edge(alpha, int(cx + d)) for d in range(-int(span * 0.08), int(span * 0.08) + 1, 2))
    ny = min(neck_top, (ly + ry) / 2 - span * 0.1) - span * 0.035
    hook = span * 0.2  # hook height above the hanger's neck

    pad_top = int(max(0, -(ny - hook - span * 0.04)))
    cw, ch = w, h + pad_top
    canvas = Image.new('RGBA', (cw * SS, ch * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    S = lambda v: v * SS
    oy = pad_top
    thick = max(4, span * 0.04)

    # body: a slim triangle from the neck down to each shoulder tip
    body = [
        (S(cx - thick * 0.9), S(ny + oy)),
        (S(cx + thick * 0.9), S(ny + oy)),
        (S(rx + thick * 0.4), S(ry + oy)),
        (S(rx - thick * 0.2), S(ry + oy + thick)),
        (S(cx), S(ny + oy + thick * 1.3)),
        (S(lx + thick * 0.2), S(ly + oy + thick)),
        (S(lx - thick * 0.4), S(ly + oy)),
    ]
    d.polygon(body, fill=(22, 22, 24, 255))
    # rounded shoulder ends
    for x, y in ((lx, ly), (rx, ry)):
        r = thick * 0.55
        d.ellipse([S(x - r), S(y + oy), S(x + r), S(y + oy + 2 * r)], fill=(22, 22, 24, 255))
    # a soft highlight along the top edge of each arm
    hl = (78, 80, 86, 255)
    d.line([(S(cx), S(ny + oy + thick * 0.25)), (S(rx), S(ry + oy + thick * 0.2))], fill=hl, width=int(S(thick * 0.18)))
    d.line([(S(cx), S(ny + oy + thick * 0.25)), (S(lx), S(ly + oy + thick * 0.2))], fill=hl, width=int(S(thick * 0.18)))

    # metal hook: a stem then a curl to the left
    stem_top = ny - hook * 0.45
    metal = (150, 157, 163, 255)
    wire = int(S(max(2.2, span * 0.018)))
    d.line([(S(cx), S(ny + oy + 1)), (S(cx), S(stem_top + oy))], fill=metal, width=wire)
    r = hook * 0.28
    d.arc([S(cx - 2 * r), S(stem_top - r + oy - hook * 0.3), S(cx), S(stem_top + r + oy - hook * 0.3)], start=330, end=180, fill=metal, width=wire)
    d.line([(S(cx), S(stem_top + oy)), (S(cx), S(stem_top - hook * 0.3 + oy))], fill=metal, width=wire)
    # small neck cap
    d.rounded_rectangle([S(cx - thick * 0.8), S(ny + oy - thick * 0.6), S(cx + thick * 0.8), S(ny + oy + thick * 0.5)], radius=S(thick * 0.3), fill=(40, 40, 44, 255))

    hanger = canvas.resize((cw, ch), Image.LANCZOS)
    shadow = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    shadow.paste((0, 0, 0, 70), (0, 0), hanger.getchannel('A'))
    shadow = shadow.filter(ImageFilter.GaussianBlur(span * 0.006))

    out = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    out.alpha_composite(shadow, (0, 2))
    out.alpha_composite(hanger)
    out.alpha_composite(garment, (0, pad_top))  # garment in front: the hanger sits inside it
    return out


def process(name):
    im = Image.open(os.path.join(SRC, name)).convert('RGBA')
    im = im.crop(im.getbbox())
    wood = find_wood_hanger(im) if has_photo_hook(im) else set()
    if wood:
        blacken(im, wood)
        mode = 'recoloured photo hanger'
        # garments that came with a hanger are measured below it
        x0, x1 = widest_span(im.getchannel('A'), 0.25, 0.5)
    else:
        x0, x1 = widest_span(im.getchannel('A'))
        mode = 'drew hanger'
    scale = SHOULDER * 1.15 / max(1, x1 - x0)
    if abs(scale - 1) > 0.02:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    if not wood:
        im = add_hanger(im)
    im.save(os.path.join(OUT, name))
    return mode, im.size


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for f in sorted(os.listdir(SRC), key=lambda n: (len(n), n)):
        if f.startswith('rack') and f.endswith('.png'):
            mode, size = process(f)
            print(f, mode, size)
