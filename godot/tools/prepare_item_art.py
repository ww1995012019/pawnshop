#!/usr/bin/env python3
"""Pack original v2 item art into engine atlases, preserving exact catalogue cells.

This import step extracts the supplied grid, removes transparent matte residue,
normalizes sprite density, and writes lossless nearest-neighbor runtime textures.
The generated master paintings remain untouched in art-source/items-v2/.
"""
from pathlib import Path
import json

from scipy import ndimage
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "art-source/items-v2"
OUT = ROOT / "godot/assets/atlas"
CELL = 256
LOGICAL_EXTENT = 112


def extract_sprite(cell: Image.Image) -> Image.Image:
    rgba = np.asarray(cell.convert("RGBA")).copy()
    # Generated masters contain low-alpha matte outside the actual artwork.
    # Import a hard sprite silhouette so it cannot become a colored glow on UI.
    mask = (rgba[:, :, 3] >= 128).astype(np.uint8)
    labels, count = ndimage.label(mask, structure=np.ones((3, 3)))
    areas = np.bincount(labels.ravel())
    if count == 0:
        raise ValueError("Empty art cell")
    largest_id = int(np.argmax(areas[1:])) + 1
    largest = areas[largest_id]
    boxes = ndimage.find_objects(labels)
    keep = np.zeros_like(mask)
    for i in range(1, count + 1):
        if areas[i] < max(20, largest * 0.012):
            continue
        ys, xs = boxes[i - 1]
        # Reject a narrow strip from a neighboring source cell, not isolated
        # elements such as the hologram or the floating magnetic ring.
        edge_strip = ((xs.start == 0 or xs.stop == mask.shape[1]) and xs.stop - xs.start < mask.shape[1] * 0.12) or ((ys.start == 0 or ys.stop == mask.shape[0]) and ys.stop - ys.start < mask.shape[0] * 0.10)
        if i != largest_id and edge_strip:
            continue
        keep[labels == i] = 1
    rgba[:, :, 3] = keep * 255
    rgba[keep == 0, :3] = 0
    sprite = Image.fromarray(rgba).crop(Image.fromarray(keep).getbbox())
    ratio = LOGICAL_EXTENT / max(sprite.size)
    size = (max(1, round(sprite.width * ratio)), max(1, round(sprite.height * ratio)))
    logical = sprite.resize(size, Image.Resampling.NEAREST)
    return logical.resize((size[0] * 2, size[1] * 2), Image.Resampling.NEAREST)


def main() -> None:
    manifest = json.loads((SOURCE / "manifest.json").read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    report = {}
    for group, config in manifest["groups"].items():
        cols, rows = config["columns"], config["rows"]
        for face in ("front", "back"):
            source = Image.open(SOURCE / f"{group}-{face}.png").convert("RGBA")
            atlas = Image.new("RGBA", (cols * CELL, rows * CELL))
            sizes = []
            for i in range(cols * rows):
                x, y = i % cols, i // cols
                box = (round(x * source.width / cols), round(y * source.height / rows),
                       round((x + 1) * source.width / cols), round((y + 1) * source.height / rows))
                sprite = extract_sprite(source.crop(box))
                atlas.alpha_composite(sprite, (x * CELL + (CELL - sprite.width) // 2,
                                               y * CELL + (CELL - sprite.height) // 2))
                sizes.append(sprite.size)
            key = f"{config['prefix']}-{face}"
            atlas.save(OUT / f"{key}.png", optimize=True)
            # Painted pixel shadows already describe volume; luminance-derived
            # normals would turn small colored details into false dents/ridges.
            normal = Image.new("RGBA", atlas.size, (128, 128, 255, 0))
            normal.putalpha(atlas.getchannel("A"))
            normal.save(OUT / f"{key}_n.png", optimize=True)
            report[key] = sizes
    print("Packed", sum(len(v) for v in report.values()), "front/back sprite cells")


if __name__ == "__main__":
    main()
