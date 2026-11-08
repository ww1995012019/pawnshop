"""Cut the painted UI surfaces into nine-patch skins at three scales.

Godot's StyleBoxTexture draws its borders at source size, so a 512 px cell with
an 84 px rim cannot skin a 58 px key directly. This writes pre-scaled copies:
  lg (panels), sm (keys), xs (chips and small sockets).
Run: python3 godot/tools/make_ui_skin.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "assets" / "ui"
OUT = ROOT / "skin"
SCALES = {"lg": 0.45, "sm": 0.2, "xs": 0.13}
# name: (atlas, column, row, columns, rows)
CELLS = {
    "glass": ("orbital-ui-surfaces", 0, 0, 3, 2),
    "strip": ("orbital-ui-surfaces", 1, 0, 3, 2),
    "amber": ("orbital-ui-surfaces", 2, 0, 3, 2),
    "graphite": ("orbital-ui-surfaces", 0, 1, 3, 2),
    "socket": ("orbital-ui-surfaces", 1, 1, 3, 2),
    "rail": ("orbital-ui-surfaces", 2, 1, 3, 2),
    "paper": ("orbital-ui-kit", 0, 0, 2, 1),
    "screen": ("orbital-ui-kit", 1, 0, 2, 1),
}

OUT.mkdir(exist_ok=True)
for name, (atlas, cx, cy, cols, rows) in CELLS.items():
    im = Image.open(ROOT / f"{atlas}.png").convert("RGBA")
    w, h = im.size[0] // cols, im.size[1] // rows
    cell = im.crop((cx * w, cy * h, (cx + 1) * w, (cy + 1) * h))
    for tag, s in SCALES.items():
        cell.resize((round(w * s), round(h * s)), Image.LANCZOS).save(OUT / f"{name}_{tag}.png")
        print(name, tag, round(w * s), round(h * s))
