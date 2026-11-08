#!/usr/bin/env python3
"""Build the Godot slice's layered art from the existing painted sources.

The counter painting is one flat image. This splits it into depth layers so the
visitor can stand *behind* the counter and the layers can move with parallax:

  bg.png  - room, window and floor; the counter and desk props are inpainted away
  fg.png  - counter top/front plus the desk lamp, monitor, mug and plant (alpha)

Every colour layer also gets a normal map derived from its luminance, so Godot's
2D lights shade the paint instead of only tinting it.

Usage: python3 godot/tools/prepare_assets.py
"""
from pathlib import Path
import shutil
import cv2
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "assets/resources"
OUT = ROOT / "godot/assets"
SCALE = 1.5  # painted scenes are pre-scaled with Lanczos for high-DPI screens
COUNTER_EDGE = 590  # source y where the floor meets the counter top


def save(img: Image.Image, rel: str) -> None:
    path = OUT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, optimize=True)


def upscale(img: Image.Image, factor: float) -> Image.Image:
    w, h = img.size
    out = img.resize((round(w * factor), round(h * factor)), Image.LANCZOS)
    rgb = out.convert("RGB").filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    if img.mode == "RGBA":
        rgb = rgb.convert("RGBA")
        rgb.putalpha(out.getchannel("A"))
    return rgb


def normal_map(img: Image.Image, strength: float = 2.2, detail: float = 1.2, shape: float = 6.0) -> Image.Image:
    """Height from luminance: fine paint detail plus broad form, Y+ up (OpenGL)."""
    rgba = np.asarray(img.convert("RGBA")).astype(np.float32) / 255.0
    lum = rgba[..., 0] * 0.3 + rgba[..., 1] * 0.59 + rgba[..., 2] * 0.11
    h = cv2.GaussianBlur(lum, (0, 0), detail) * 0.6 + cv2.GaussianBlur(lum, (0, 0), shape) * 0.4
    dx = cv2.Sobel(h, cv2.CV_32F, 1, 0, ksize=3)
    dy = cv2.Sobel(h, cv2.CV_32F, 0, 1, ksize=3)
    n = np.dstack((-dx * strength, dy * strength, np.ones_like(h)))
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    enc = (n * 0.5 + 0.5) * 255
    out = np.dstack((enc, rgba[..., 3:4] * 255)).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def grabcut(rgb: np.ndarray, box, sure_fg, sure_bg) -> np.ndarray:
    """Silhouette of desk props inside `box`, seeded with known fg/bg rectangles."""
    mask = np.full(rgb.shape[:2], cv2.GC_BGD, np.uint8)
    x0, y0, x1, y1 = box
    mask[y0:y1, x0:x1] = cv2.GC_PR_BGD
    for (a, b, c, d) in sure_fg:
        mask[b:d, a:c] = cv2.GC_FGD
    for (a, b, c, d) in sure_bg:
        mask[b:d, a:c] = cv2.GC_BGD
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), mask, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
    return np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)


def counter_layers() -> None:
    src = Image.open(SRC / "art/orbital-counter.png").convert("RGB")
    rgb = np.asarray(src)
    h, w = rgb.shape[:2]
    fg = np.zeros((h, w), np.uint8)
    fg[COUNTER_EDGE:, :] = 255
    # Desk lamp, monitor and mug on the left desk.
    fg |= grabcut(rgb, (0, 222, 310, 650),
                  sure_fg=[(165, 300, 280, 362), (140, 405, 262, 560), (122, 545, 212, 612), (20, 250, 70, 600)],
                  sure_bg=[(290, 222, 310, 520), (250, 222, 310, 290)])
    # Plant and glowing jar on the right.
    fg |= grabcut(rgb, (1430, 385, 1672, 660),
                  sure_fg=[(1565, 505, 1648, 640), (1590, 420, 1660, 470)],
                  sure_bg=[(1430, 385, 1470, 450)])
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    alpha = cv2.GaussianBlur(fg, (0, 0), 1.2)
    # Background: paint over everything the foreground covers (plus a margin), so
    # parallax never reveals a duplicated counter edge or a ghost lamp.
    hole = cv2.dilate(fg, np.ones((15, 15), np.uint8))
    bg = cv2.inpaint(rgb, hole, 9, cv2.INPAINT_TELEA)
    bg_img = upscale(Image.fromarray(bg), SCALE)
    fg_img = Image.fromarray(np.dstack((rgb, alpha)), "RGBA")
    fg_img = upscale(fg_img, SCALE)
    save(bg_img, "scene/counter_bg.png")
    save(fg_img, "scene/counter_fg.png")
    save(normal_map(bg_img, strength=1.6), "scene/counter_bg_n.png")
    save(normal_map(fg_img, strength=2.2), "scene/counter_fg_n.png")


def cell(atlas: str, index: int, cols: int, rows: int, inset: float) -> Image.Image:
    im = Image.open(SRC / f"art/{atlas}.png").convert("RGBA")
    cw, ch = im.width / cols, im.height / rows
    x, y = (index % cols) * cw, (index // cols) * ch
    return im.crop((round(x + cw * inset), round(y + ch * inset), round(x + cw * (1 - inset)), round(y + ch * (1 - inset))))


def trim(img: Image.Image, pad: int = 6) -> Image.Image:
    box = img.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    if not box:
        return img
    x0, y0, x1, y1 = box
    return img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad)))


def characters() -> None:
    moods = {"neutral": "orbital-characters", "focused": "orbital-characters-focused", "question": "orbital-characters-question",
             "happy": "orbital-characters-happy", "reject": "orbital-characters-reject", "tired": "orbital-characters-tired"}
    for mood, atlas in moods.items():
        img = cell(atlas, 3, 5, 1, 0.012)  # CHR-004 栗叔
        save(img, f"chars/chr004_{mood}.png")
        if mood == "neutral":
            save(normal_map(img, strength=2.6, shape=4), "chars/chr004_n.png")


def items() -> None:
    for face, atlas in (("front", "orbital-items-front"), ("back", "orbital-items-back")):
        img = trim(cell(atlas, 5, 6, 4, 0.035))  # ITM-011 折叠巡检蜂
        img = upscale(img, 2.0)
        save(img, f"items/itm011_{face}.png")
        save(normal_map(img, strength=3.0, shape=3), f"items/itm011_{face}_n.png")
    for i, name in ((0, "lens"), (1, "uv")):
        save(trim(cell("orbital-tools", i, 3, 2, 0.02)), f"tools/{name}.png")


def copy_shared() -> None:
    (OUT / "ui").mkdir(parents=True, exist_ok=True)
    for name in ("orbital-ui-surfaces.png", "orbital-ui-kit.png", "orbital-hud.png"):
        shutil.copy(SRC / "art" / name, OUT / "ui" / name)
    (OUT / "fonts").mkdir(parents=True, exist_ok=True)
    for name in ("orbital-sans.ttf", "orbital-mono.ttf", "orbital-sans-LICENSE.txt", "orbital-mono-LICENSE.txt"):
        shutil.copy(SRC / "fonts" / name, OUT / "fonts" / name)
    (OUT / "audio").mkdir(parents=True, exist_ok=True)
    for wav in (SRC / "audio").glob("*.wav"):
        shutil.copy(wav, OUT / "audio" / wav.name)


def other_scenes() -> None:
    for name in ("workbench", "warehouse"):
        img = upscale(Image.open(SRC / f"art/orbital-{name}.png").convert("RGB"), SCALE)
        save(img, f"scene/{name}_bg.png")
        save(normal_map(img, strength=1.6), f"scene/{name}_bg_n.png")


def atlases() -> None:
    """Whole atlases with matching normal maps; sprites pick their cell by region."""
    for key in ("orbital-items-front", "orbital-items-back", "orbital-expansion-front", "orbital-expansion-back",
                "orbital-annex-front", "orbital-annex-back"):
        img = Image.open(SRC / f"art/{key}.png").convert("RGBA")
        save(img, f"atlas/{key}.png")
        save(normal_map(img, strength=3.0, shape=3), f"atlas/{key}_n.png")
    for key in ("orbital-characters", "orbital-characters-focused", "orbital-characters-question", "orbital-characters-happy",
                "orbital-characters-reject", "orbital-characters-tired", "orbital-people-annex"):
        img = Image.open(SRC / f"art/{key}.png").convert("RGBA")
        save(img, f"atlas/{key}.png")
        save(normal_map(img, strength=2.6, shape=4), f"atlas/{key}_n.png")
    for key in ("orbital-tools",):
        save(Image.open(SRC / f"art/{key}.png").convert("RGBA"), f"atlas/{key}.png")


if __name__ == "__main__":
    other_scenes()
    atlases()
    counter_layers()
    characters()
    items()
    copy_shared()
    # Keep the newer authored item set when rebuilding shared scene assets.
    from prepare_item_art import main as prepare_item_art
    prepare_item_art()
    print("Godot slice assets ready in", OUT)
