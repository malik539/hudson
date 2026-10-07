#!/usr/bin/env python3
"""Generate responsive WebP/JPEG/PNG assets for the landing page.

Usage: python3 scripts/optimize-images.py <source-dir>
The source directory must contain the approved originals (see README).
"""
import sys, os
from PIL import Image, ImageOps

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "img")
os.makedirs(OUT, exist_ok=True)

def find(prefix):
    for f in os.listdir(SRC):
        if f.startswith(prefix):
            return os.path.join(SRC, f)
    raise SystemExit(f"missing source starting with {prefix}")

def save_set(im, name, widths, quality=82, jpg=True):
    for w in widths:
        r = im.copy()
        if r.width > w:
            r = r.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        r.save(os.path.join(OUT, f"{name}-{w}.webp"), "WEBP", quality=quality, method=6)
        if jpg:
            r.convert("RGB").save(os.path.join(OUT, f"{name}-{w}.jpg"), "JPEG", quality=quality, optimize=True, progressive=True)

# --- Logo: derive a transparent mark from the approved square lockup (white mark on brand blue)
logo = Image.open(find("Hudson_Valley_Logo_jpg")).convert("RGB")
lum = ImageOps.grayscale(logo)
# white pixels -> opaque mark; blue background -> transparent
mask = lum.point(lambda v: 255 if v > 200 else (0 if v < 150 else int((v - 150) * 255 / 50)))
def tinted(rgb):
    layer = Image.new("RGBA", logo.size, rgb + (0,))
    layer.putalpha(mask)
    return layer
tinted((255, 255, 255)).save(os.path.join(OUT, "logo-white.png"), "PNG", optimize=True)
tinted((0, 125, 195)).save(os.path.join(OUT, "logo-blue.png"), "PNG", optimize=True)
# Mark only (tooth + orbit, no wordmark) for the header / favicon
bbox = (0, 0, logo.width, int(logo.height * 0.70))
mark_blue = tinted((0, 125, 195)).crop(bbox)
mark_white = tinted((255, 255, 255)).crop(bbox)
mark_blue.save(os.path.join(OUT, "mark-blue.png"), "PNG", optimize=True)
mark_white.save(os.path.join(OUT, "mark-white.png"), "PNG", optimize=True)
# Favicon / touch icon on brand-blue square
for size, fname in ((32, "favicon-32.png"), (180, "apple-touch-icon.png"), (192, "icon-192.png")):
    ico = Image.new("RGBA", (size, size), (0, 125, 195, 255))
    m = mark_white.copy()
    m.thumbnail((int(size * 0.8), int(size * 0.8)), Image.LANCZOS)
    ico.alpha_composite(m, ((size - m.width) // 2, (size - m.height) // 2))
    ico.save(os.path.join(OUT, fname), "PNG", optimize=True)

# --- Dr. Turturro portrait (approved "Hudson Valley - Doctor" image)
doc = Image.open(find("Hudson_Valley_Doctor")).convert("RGB")
save_set(doc, "dr-turturro", [275])
# Square avatar for the hero trust strip
side = doc.width
avatar = doc.crop((0, 0, side, side)).resize((160, 160), Image.LANCZOS)
avatar.save(os.path.join(OUT, "dr-turturro-avatar-160.webp"), "WEBP", quality=85, method=6)
avatar.save(os.path.join(OUT, "dr-turturro-avatar-160.jpg"), "JPEG", quality=85, optimize=True)

# --- Hero portrait of Dr. Turturro, cropped from the approved high-res team photo ("Hudson Valley - Staff", 1080x1350)
try:
    team = Image.open(find("Hudson_Valley_Staff_1r9ZTM")).convert("RGB")
    save_set(team.crop((90, 180, 600, 818)), "dr-turturro-hero", [240, 480])
except SystemExit:
    print("team photo not found – skipping hero portrait")

# --- Office exterior (approved "Hudson Valley - building" image), cropped to 3:2
bld = Image.open(find("Hudson_Valley_building")).convert("RGB")
bld = ImageOps.fit(bld, (1200, 800), Image.LANCZOS, centering=(0.5, 0.55))
save_set(bld, "office", [480, 800], quality=78)

print("written to", OUT)
for f in sorted(os.listdir(OUT)):
    print(f"{os.path.getsize(os.path.join(OUT, f)):>8}  {f}")
